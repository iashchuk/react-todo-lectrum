// Core
import React, { Component } from 'react';

// Instruments
import Styles from './styles.md.css';
import { api } from '../../REST';
import { sortTasksByGroup } from '../../instruments';
import FlipMove from 'react-flip-move';

// Components
import Task from '../Task';
import Checkbox from '../../theme/assets/Checkbox';
import Spinner from '../Spinner';

const PALETTE_COLOR_2 = '#fff';
const PALETTE_COLOR_7 = '#363636';

export default class Scheduler extends Component {
    state = {
        tasks:           [],
        newTaskMessage:  '',
        tasksFilter:     '',
        isTasksFetching: false,
    };

    componentDidMount () {
        this._fetchTasksAsync();
    }

    _fetchTasksAsync = async () => {
        try {
            this._setTasksFetchingState(true);

            const data = await api.fetchTasks();

            this.setState({
                tasks: sortTasksByGroup(data),
            });
            this._setTasksFetchingState(false);
        } catch (error) {
            console.error(error);
        }
    };

    _createTaskAsync = async (event) => {
        event.preventDefault();
        const { tasks, newTaskMessage } = this.state;

        if (newTaskMessage.trim()) {
            try {
                this._setTasksFetchingState(true);

                const task = await api.createTask(newTaskMessage);

                this.setState({
                    tasks:          sortTasksByGroup([task, ...tasks]),
                    newTaskMessage: '',
                });
                this._setTasksFetchingState(false);
            } catch (error) {
                console.error(error);
            }
        } else {
            return null;
        }
    };

    _removeTaskAsync = async (id) => {
        try {
            this._setTasksFetchingState(true);

            await api.removeTask(id);

            this.setState((prevState) => ({
                tasks: prevState.tasks.filter((task) => task.id !== id),
            }));
            this._setTasksFetchingState(false);
        } catch (error) {
            console.error(error);
        }
    };

    _updateTaskAsync = async (changedTask) => {
        this._setTasksFetchingState(true);

        const updatedTask = await api.updateTask(changedTask);

        this.setState((prevState) => ({
            tasks: sortTasksByGroup(
                prevState.tasks.map((task) =>
                    task.id === updatedTask[0].id ? updatedTask[0] : task
                )
            ),
        }));
        this._setTasksFetchingState(false);
    };

    _setTasksFetchingState = (isTasksFetching) => {
        this.setState({
            isTasksFetching,
        });
    };

    _updateTasksFilter = (event) => {
        const { value } = event.target;

        this.setState({ tasksFilter: value.toLowerCase() });
    };

    _filterTasks = (tasks, tasksFilter) => {
        if (!tasksFilter.length) {
            return tasks;
        }

        return tasks.filter((task) => {
            return task.message
                .toLowerCase()
                .includes(tasksFilter.toLowerCase());
        });
    };

    _updateNewTaskMessage = (event) => {
        this.setState({ newTaskMessage: event.target.value });
    };

    _getAllCompleted = () => {
        const { tasks } = this.state;

        return tasks.every((task) => task.completed);
    };

    _completeAllTasksAsync = async () => {
        try {
            if (this._getAllCompleted()) {
                return null;
            }

            this._setTasksFetchingState(true);

            await api.completeAllTasks(this.state.tasks);

            this.setState(({ tasks }) => ({
                tasks: sortTasksByGroup(
                    tasks.map((task) => ({ ...task, completed: true }))
                ),
            }));
        } catch (error) {
            console.log(error.message);
        } finally {
            this._setTasksFetchingState(false);
        }
    };

    render () {
        const {
            tasks,
            tasksFilter,
            newTaskMessage,
            isTasksFetching,
        } = this.state;

        const filteredTasks = this._filterTasks(tasks, tasksFilter);

        const tasksJSX = filteredTasks.map((task) => {
            return (
                <Task
                    key = { task.id }
                    { ...task }
                    _removeTaskAsync = { this._removeTaskAsync }
                    _updateTaskAsync = { this._updateTaskAsync }
                />
            );
        });

        return (
            <section className = { Styles.scheduler }>
                <Spinner isSpinning = { isTasksFetching } />
                <main>
                    <header>
                        <h1>Планировщик задач</h1>
                        <input
                            placeholder = 'Поиск'
                            type = 'search'
                            value = { tasksFilter }
                            onChange = { this._updateTasksFilter }
                        />
                    </header>
                    <section>
                        <form onSubmit = { this._createTaskAsync }>
                            <input
                                className = 'createTask'
                                maxLength = { 50 }
                                placeholder = { 'Описaние моей новой задачи' }
                                type = 'text'
                                value = { newTaskMessage }
                                onChange = { this._updateNewTaskMessage }
                            />
                            <button>Добавить задачу</button>
                        </form>
                        <div className = 'overlay'>
                            <ul>
                                <FlipMove duration = { 400 } easing = { 'ease-in-out' }>
                                    {tasksJSX}
                                </FlipMove>
                            </ul>
                        </div>
                    </section>
                    <footer>
                        <Checkbox
                            checked = { this._getAllCompleted() }
                            color1 = { PALETTE_COLOR_7 }
                            color2 = { PALETTE_COLOR_2 }
                            onClick = { this._completeAllTasksAsync }
                        />
                        <span className = { Styles.completeAllTasks }>
                            Все задачи выполнены
                        </span>
                    </footer>
                </main>
            </section>
        );
    }
}
