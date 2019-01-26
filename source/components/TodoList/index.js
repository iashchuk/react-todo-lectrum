// Core
import React, { Component } from "react";

// Components
import Task from "../Task";

export default class TodoList extends Component {
    render () {
        const todoList = this.props.tasks.map((task) => {
            const { id, ...taskProps } = task;

            return <Task key = { id } { ...taskProps } />;
        });

        return <ul>{todoList}</ul>;
    }
}
