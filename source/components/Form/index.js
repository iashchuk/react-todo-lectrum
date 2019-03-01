import React, { Component } from 'react';

class Form extends Component {
    state = {
        message: '',
    };

    onChange = (evt) => {
        this.setState({ [evt.target.name]: evt.target.value.trim() });
    };

    onSubmit = (evt) => {
        const { message } = this.state;
        const { onAdd } = this.props;

        evt.preventDefault();
        onAdd({
            id:        Date.now(),
            message,
            completed: false,
            favorite:  false,
        });
        this.setState({ message: '' });
    };

    render () {
        const { message } = this.state;

        return (
            <form onSubmit = { this.onSubmit }>
                <input
                    required
                    maxLength = { 50 }
                    minLength = { 4 }
                    name = 'message'
                    placeholder = 'Описание моей новой задачи'
                    type = 'text'
                    value = { message }
                    onChange = { this.onChange }
                />
                <button>Добавить задачу</button>
            </form>
        );
    }
}

export default Form;
