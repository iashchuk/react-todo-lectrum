import React, { Component } from 'react';

class Form extends Component {
    onSubmit = (evt) => {
        const { newTaskMessage, _createTaskAsync } = this.props;

        evt.preventDefault();
        _createTaskAsync({
            id:        Date.now(),
            message:   newTaskMessage,
            completed: false,
            favorite:  false,
        });
        this.setState({ message: '' });
    };

    render () {
        const { newTaskMessage, _updateNewTaskMessage } = this.props;

        return (
            <form onSubmit = { this.onSubmit }>
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
