// Core
import React, { Component } from 'react';

// Instruments
import Styles from './styles.md.css';
import { api } from '../../REST'; // ! Импорт модуля API должен иметь именно такой вид (import { api } from '../../REST')
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
        this.setState({
            isLoading: true,
        });

        const data = await api.getData();

        this.setState({
            tasks:     data,
            isLoading: false,
        });
    }

    updateTask = (id, message) => {
        this.setState((prevState) => ({
            tasks: sortTasksByGroup(
                prevState.tasks.map((task) =>
                    task.id === id ? { ...task, message } : task
                )
            ),
        }));
    };

    searchTask = (tasks, search) => {
        if (!search.length) {
            return tasks;
        }

        return tasks.filter((task) => {
            return task.message.toLowerCase().includes(search.toLowerCase());
        });
    };

    onAdd = async (message) => {
        const { tasks } = this.state;

        this.setState({
            isLoading: true,
        });

        const task = await api.onAdd(message);

        this.setState({
            tasks:     sortTasksByGroup([task, ...tasks]),
            isLoading: false,
        });
    };

    onDelete = (id) => {
        const { tasks } = this.state;

        return this.setState({
            tasks: tasks.filter((task) => task.id !== id),
        });
    };

    onDone = (id) => {
        this.setState((prevState) => ({
            tasks: sortTasksByGroup(
                prevState.tasks.map((task) =>
                    task.id === id
                        ? { ...task, completed: !task.completed }
                        : task
                )
            ),
        }));
    };

    onFavorite = (id) => {
        this.setState((prevState) => ({
            tasks: sortTasksByGroup(
                prevState.tasks.map((task) =>
                    task.id === id
                        ? { ...task, favorite: !task.favorite }
                        : task
                )
            ),
        }));
    };

    onSearchChange = (search) => {
        this.setState({ search });
    };

    isCompleteAllTasks = () => {
        const { tasks } = this.state;

        return tasks.every((task) => task.completed);
    };

    onCompleteAllTasks = () => {
        this.setState((prevState) => ({
            tasks: prevState.tasks.map((task) => {
                task.completed = true;

                return task;
            }),
        }));
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
                            updateTask = { this.updateTask }
                            onDelete = { this.onDelete }
                            onDone = { this.onDone }
                            onFavorite = { this.onFavorite }
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
