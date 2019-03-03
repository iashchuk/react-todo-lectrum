import React, { Component } from 'react';

class Form extends Component {
    render () {
        const {
            newTaskMessage,
            _createTaskAsync,
            _updateNewTaskMessage,
        } = this.props;

        return (
            <form onSubmit = { _createTaskAsync }>
                <input
                    required
                    maxLength = { 50 }
                    minLength = { 4 }
                    name = 'message'
                    placeholder = 'Описание моей новой задачи'
                    type = 'text'
                    value = { newTaskMessage }
                    onChange = { _updateNewTaskMessage }
                />
                <button>Добавить задачу</button>
            </form>
        );
    }
}

export default Form;
