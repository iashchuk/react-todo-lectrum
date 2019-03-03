// Core
import React, { Component } from 'react';

// Instruments
import Styles from './styles.md.css';
import { api } from '../../REST';
import { sortTasksByGroup } from '../../instruments';

// Components
import Form from '../Form';
import Title from '../Title';
import Search from '../Search';
import CompleteIndicator from '../CompleteIndicator';
import TodoList from '../TodoList';
import Spinner from '../Spinner';

const APP_NAME = 'Планировщик задач';

export default class Scheduler extends Component {
    state = {
        tasks:      [],
        search:     '',
        isSpinning: true,
    };

    async componentDidMount () {
        try {
            this.setState({
                isSpinning: true,
            });

            const data = await api.fetchTasks();

            this.setState({
                tasks:      sortTasksByGroup(data),
                isSpinning: false,
            });
        } catch (error) {
            console.error(error);
        }
    }

    searchTask = (tasks, search) => {
        if (!search.length) {
            return tasks;
        }

        return tasks.filter((task) => {
            return task.message.toLowerCase().includes(search.toLowerCase());
        });
    };

    onAdd = async (message) => {
        try {
            const { tasks } = this.state;

            this.setState({
                isSpinning: true,
            });

            const task = await api.createTask(message);

            this.setState({
                tasks:      sortTasksByGroup([task, ...tasks]),
                isSpinning: false,
            });
        } catch (error) {
            console.error(error);
        }
    };

    onDelete = async (id) => {
        try {
            this.setState({
                isSpinning: true,
            });

            await api.removeTask(id);

            this.setState((prevState) => ({
                tasks:      prevState.tasks.filter((task) => task.id !== id),
                isSpinning: false,
            }));
        } catch (error) {
            console.error(error);
        }
    };

    onUpdate = async (changedTask) => {
        this.setState({
            isSpinning: true,
        });

        const [updatedTask] = await api.updateTask([changedTask]);

        this.setState((prevState) => ({
            tasks: sortTasksByGroup(
                prevState.tasks.map((task) =>
                    task.id === updatedTask.id ? updatedTask : task
                )
            ),
            isSpinning: false,
        }));
    };

    onSearchChange = (search) => {
        this.setState({ search });
    };

    isCompleteAllTasks = () => {
        const { tasks } = this.state;

        return tasks.every((task) => task.completed);
    };

    onCompleteAllTasks = async () => {
        const { tasks } = this.state;

        this.setState({
            isSpinning: true,
        });

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
            isSpinning: false,
        }));
    };

    render () {
        const { tasks, search, isSpinning } = this.state;
        const searchTasks = this.searchTask(tasks, search);

        return (
            <section className = { Styles.scheduler }>
                <Spinner isSpinning = { isSpinning } />
                <main>
                    <header>
                        <Title text = { APP_NAME } />
                        <Search onSearchChange = { this.onSearchChange } />
                    </header>
                    <section>
                        <Form onAdd = { this.onAdd } />
                        <TodoList
                            tasks = { searchTasks }
                            onDelete = { this.onDelete }
                            onUpdate = { this.onUpdate }
                        />
                    </section>
                    <footer>
                        <CompleteIndicator
                            isCompleteAllTasks = { this.isCompleteAllTasks }
                            onCompleteAllTasks = { this.onCompleteAllTasks }
                        />
                    </footer>
                </main>
            </section>
        );
    }
}
