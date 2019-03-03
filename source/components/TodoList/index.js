// Core
import React, { Component } from 'react';
import Move from 'react-flip-move';

// Components
import Task from '../Task';

export default class TodoList extends Component {
    render () {
        const { tasks, _updateTaskAsync, _removeTaskAsync } = this.props;

        const todoList = tasks.map((task) => {
            const { id, ...taskProps } = task;

            return (
                <Task
                    id = { id }
                    key = { id }
                    { ...taskProps }
                    _removeTaskAsync = { () => _removeTaskAsync(id) }
                    _updateTaskAsync = { _updateTaskAsync }
                />
            );
        });

        return (
            <ul>
                <Move duration = { 400 } easing = 'ease-in-out'>
                    {todoList}
                </Move>
            </ul>
        );
    }
}
