// Core
import React, { Component } from 'react';

// Components
import Task from '../Task';

export default class TodoList extends Component {
    render () {
        const { tasks, onDelete, onDone } = this.props;

        const todoList = tasks.map((task) => {
            const { id, ...taskProps } = task;

            return (
                <Task
                    key = { id }
                    { ...taskProps }
                    onDelete = { () => onDelete(id) }
                    onDone = { () => onDone(id) }
                />
            );
        });

        return <ul>{todoList}</ul>;
    }
}
