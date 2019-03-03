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

    searchTask = (tasks, tasksFilter) => {
        if (!tasksFilter.length) {
            return tasks;
        }

        return tasks.filter((task) => {
            return task.message
                .toLowerCase()
                .includes(tasksFilter.toLowerCase());
        });
    };

    _updateNewTaskMessage = (evt) => {
        this.setState({ newTaskMessage: evt.target.value.trim() });
    };

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

    _createTaskAsync = async (evt) => {
        evt.preventDefault();
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

    _updateTasksFilter = (evt) => {
        const { value } = evt.target;

        this.setState({ tasksFilter: value.toLowerCase() });
    };

    _getAllCompleted = () => {
        const { tasks } = this.state;

        return tasks.every((task) => task.completed);
    };

    _setTasksFetchingState = (isTasksFetching) => {
        this.setState({
            isTasksFetching,
        });
    };

    _completeAllTasksAsync = async () => {
        const { tasks } = this.state;
        const notCompleted = tasks.filter((task) => !task.completed);

        if (notCompleted.length) {
            try {
                this._setTasksFetchingState(true);

                const completedTasks = await tasks.map((task) => {
                    task.completed = true;

                    return task;
                });

                await api.completeAllTasks(completedTasks);

                this.setState((prevState) => ({
                    tasks: prevState.tasks.map((task) => {
                        task.completed = true;

                        return task;
                    }),
                }));
                this._setTasksFetchingState(false);
            } catch (error) {
                console.error(error);
            }
        } else {
            return null;
        }
    };

    render () {
        const {
            tasks,
            tasksFilter,
            newTaskMessage,
            isTasksFetching,
        } = this.state;

        const searchTasks = this.searchTask(tasks, tasksFilter);

        const tasksJSX = searchTasks.map((task) => {
            const { id, ...taskProps } = task;

            return (
                <Task
                    id = { id }
                    key = { id }
                    { ...taskProps }
                    _removeTaskAsync = {this._removeTaskAsync }
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
                            color1 = '#363636'
                            color2 = '#fff'
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
