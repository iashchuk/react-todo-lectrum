import React, { Component } from 'react';

class Form extends Component {
    render () {
        return (
            <form>
                <input
                    maxLength = { 50 }
                    placeholder = 'Описание моей новой задачи'
                    type = 'text'
                />
                <button>Добавить задачу</button>
            </form>
        );
    }
}

export default Form;
