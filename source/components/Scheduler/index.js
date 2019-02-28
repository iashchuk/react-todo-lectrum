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
        tasks:     [],
        search:    '',
        isLoading: true,
    };

    async componentDidMount () {
        try {
            this.setState({
                isLoading: true,
            });

            const data = await api.getData();

            this.setState({
                tasks:     sortTasksByGroup(data),
                isLoading: false,
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
                isLoading: true,
            });

            const task = await api.onAdd(message);

            this.setState({
                tasks:     sortTasksByGroup([task, ...tasks]),
                isLoading: false,
            });
        } catch (error) {
            console.error(error);
        }
    };

    onDelete = async (id) => {
        try {
            this.setState({
                isLoading: true,
            });

            await api.onDelete(id);

            this.setState((prevState) => ({
                tasks:     prevState.tasks.filter((task) => task.id !== id),
                isLoading: false,
            }));
        } catch (error) {
            console.error(error);
        }
    };

    onUpdate = async (changedTask) => {
        this.setState({
            isLoading: true,
        });

        const [updatedTask] = await api.onUpdate([changedTask]);

        this.setState((prevState) => ({
            tasks: sortTasksByGroup(
                prevState.tasks.map((task) =>
                    task.id === updatedTask.id ? updatedTask : task
                )
            ),
            isLoading: false,
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
        this.setState({
            isLoading: true,
        });

        const completedTasks = this.state.tasks.map((task) => {
            task.completed = true;

            return task;
        });

        const updatedTasks = await api.onUpdate(completedTasks);

        this.setState({
            tasks:     sortTasksByGroup(updatedTasks),
            isLoading: false,
        });
    };

    render () {
        const { tasks, search, isLoading } = this.state;
        const searchTasks = this.searchTask(tasks, search);

        return (
            <section className = { Styles.scheduler }>
                <Spinner isLoading = { isLoading } />
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
