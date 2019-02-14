// Core
import React, { Component } from 'react';

// Instruments
import Styles from './styles.md.css';
import { api, data } from '../../REST'; // ! Импорт модуля API должен иметь именно такой вид (import { api } from '../../REST')
import { sortTasksByGroup } from '../../instruments';

// Components
import Form from '../Form';
import Title from '../Title';
import Search from '../Search';
import CompleteIndicator from '../CompleteIndicator';
import TodoList from '../TodoList';

const APP_NAME = 'Планировщик задач';

export default class Scheduler extends Component {
    state = {
        tasks:  data,
        search: '',
    };

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

    onAdd = (task) => {
        const { tasks } = this.state;

        this.setState({ tasks: sortTasksByGroup([task, ...tasks]) });
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

    onComplete = () => {
        const { tasks } = this.state;

        return tasks.every((task) => task.completed);
    };

    render () {
        const { tasks, search } = this.state;
        const searchTasks = this.searchTask(tasks, search);

        return (
            <section className = { Styles.scheduler }>
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
                        <CompleteIndicator onComplete = { this.onComplete } />
                    </footer>
                </main>
            </section>
        );
    }
}
