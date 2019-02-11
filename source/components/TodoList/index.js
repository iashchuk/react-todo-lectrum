// Core
import React, { Component } from 'react';

// Components
import Task from '../Task';

export default class TodoList extends Component {
    render () {
        const { tasks, updateTask, onDelete, onDone, onFavorite } = this.props;

        const todoList = tasks.map((task) => {
            const { id, ...taskProps } = task;

            return (
                <Task
                    id = { id }
                    key = { id }
                    { ...taskProps }
                    updateTask = { updateTask }
                    onDelete = { () => onDelete(id) }
                    onDone = { () => onDone(id) }
                    onFavorite = { () => onFavorite(id) }
                />
            );
        });

        return <ul>{todoList}</ul>;
    }
}
