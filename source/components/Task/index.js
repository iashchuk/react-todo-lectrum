// Core
import React, { PureComponent } from 'react';
import { string, bool, func } from 'prop-types';

// Instruments
import Styles from './styles.md.css';
import cx from 'classnames';

// Components
import Checkbox from '../../theme/assets/Checkbox';
import Remove from '../../theme/assets/Remove';
import Edit from '../../theme/assets/Edit';
import Star from '../../theme/assets/Star';

const PALETTE_COLOR_1 = '#000';
const PALETTE_COLOR_2 = '#FFF';
const PALETTE_COLOR_3 = '#3B8EF3';

export default class Task extends PureComponent {
    static propTypes = {
        _removeTaskAsync: func.isRequired,
        _updateTaskAsync: func.isRequired,
        completed:        bool.isRequired,
        favorite:         bool.isRequired,
        id:               string.isRequired,
        message:          string.isRequired,
    };

    state = {
        isTaskEditing: false,
        newMessage:    this.props.message,
    };

    taskInput = React.createRef();

    _getTaskShape = ({
        id = this.props.id,
        completed = this.props.completed,
        favorite = this.props.favorite,
        message = this.props.message,
    }) => ({
        id,
        completed,
        favorite,
        message,
    });

    _setTaskEditingState = (isTaskEditing) => {
        const input = this.taskInput.current;

        if (isTaskEditing) {
            input.disabled = !isTaskEditing;
            input.focus();
        }

        this.setState({ isTaskEditing });
    };

    _cancelUpdatingTaskMessage = () => {
        const { message } = this.props;

        this.setState({
            isTaskEditing: false,
            newMessage:    message,
        });
    };

    _updateNewTaskMessage = (event) => {
        this.setState({ newMessage: event.target.value });
    };

    _updateTask = () => {
        const { _updateTaskAsync, message } = this.props;
        const { newMessage } = this.state;

        if (message === newMessage) {
            this._setTaskEditingState(false);

            return null;
        }

        _updateTaskAsync(this._getTaskShape({ message: newMessage }));
        this._setTaskEditingState(false);
    };

    _updateTaskMessageOnClick = () => {
        const { isTaskEditing, newMessage } = this.state;

        if (isTaskEditing) {
            if (newMessage.trim()) {
                this._updateTask();

                return null;
            }
        }
        this._setTaskEditingState(true);
    };

    _toggleTaskCompletedState = () => {
        const { _updateTaskAsync, completed } = this.props;

        _updateTaskAsync(this._getTaskShape({ completed: !completed }));
    };

    _toggleTaskFavoriteState = () => {
        const { _updateTaskAsync, favorite } = this.props;

        _updateTaskAsync(this._getTaskShape({ favorite: !favorite }));
    };

    _removeTask = () => {
        const { _removeTaskAsync, id } = this.props;

        _removeTaskAsync(id);
    };

    _updateTaskMessageOnKeyDown = (event) => {
        const { newMessage } = this.state;

        if (newMessage.trim()) {
            if (event.key === 'Enter') {
                this._updateTask();
            } else if (event.key === 'Escape') {
                this._cancelUpdatingTaskMessage();
            }
        } else {
            return null;
        }
    };

    render () {
        const { newMessage, isTaskEditing } = this.state;

        const { completed, favorite } = this.props;

        return (
            <li className = { cx(Styles.task, { [Styles.completed]: completed }) }>
                <div className = { Styles.content }>
                    <Checkbox
                        inlineBlock
                        checked = { completed }
                        className = { Styles.toggleTaskCompletedState }
                        color1 = { PALETTE_COLOR_3 }
                        color2 = { PALETTE_COLOR_2 }
                        onClick = { this._toggleTaskCompletedState }
                    />
                    <input
                        disabled = { !isTaskEditing }
                        maxLength = { 50 }
                        ref = { this.taskInput }
                        type = 'text'
                        value = { newMessage }
                        onChange = { this._updateNewTaskMessage }
                        onKeyDown = { this._updateTaskMessageOnKeyDown }
                    />
                </div>
                <div className = { Styles.actions }>
                    <Star
                        inlineBlock
                        checked = { favorite }
                        className = { Styles.toggleTaskFavoriteState }
                        color1 = { PALETTE_COLOR_3 }
                        color2 = { PALETTE_COLOR_1 }
                        onClick = { this._toggleTaskFavoriteState }
                    />
                    <Edit
                        inlineBlock
                        checked = { false }
                        className = { Styles.updateTaskMessageOnClick }
                        color1 = { PALETTE_COLOR_3 }
                        color2 = { PALETTE_COLOR_1 }
                        onClick = { this._updateTaskMessageOnClick }
                    />
                    <Remove
                        inlineBlock
                        className = { Styles.removeTask }
                        color1 = { PALETTE_COLOR_3 }
                        color2 = { PALETTE_COLOR_1 }
                        onClick = { this._removeTask }
                    />
                </div>
            </li>
        );
    }
}
