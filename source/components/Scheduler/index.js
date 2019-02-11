// Core
import React, { Component } from 'react';

// Instruments
import Styles from './styles.md.css';
import { api, data } from '../../REST'; // ! Импорт модуля API должен иметь именно такой вид (import { api } from '../../REST')

// Components
import Form from '../Form';
import Title from '../Title';
import Search from '../Search';
import CompleteIndicator from '../CompleteIndicator';
import TodoList from '../TodoList';

const APP_NAME = 'Планировщик задач';

export default class Scheduler extends Component {
    state = {
        tasks: data,
    };

    onAdd = (task) => {
        const { tasks } = this.state;

        this.setState({ tasks: [task, ...tasks]});
    };

    onDelete = (id) => {
        const { tasks } = this.state;

        return this.setState({
            tasks: tasks.filter((task) => task.id !== id),
        });
    };

    onDone = (id) => {
        this.setState((prevState) => ({
            tasks: prevState.tasks.map((task) =>
                task.id === id ? { ...task, completed: !task.completed } : task
            ),
        }));
    };

    render () {
        const { tasks } = this.state;

        return (
            <section className = { Styles.scheduler }>
                <main>
                    <header>
                        <Title text = { APP_NAME } />
                        <Search />
                    </header>
                    <section>
                        <Form onAdd = { this.onAdd } />
                        <TodoList
                            tasks = { tasks }
                            onDelete = { this.onDelete }
                            onDone = { this.onDone }
                        />
                    </section>
                    <footer>
                        <CompleteIndicator />
                    </footer>
                </main>
            </section>
        );
    }
}
