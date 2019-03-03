// Core
import React, { PureComponent } from 'react';

// Instruments
import Styles from './styles.md.css';
import cx from 'classnames';

// Components
import Checkbox from '../../theme/assets/Checkbox';
import Remove from '../../theme/assets/Remove';
import Edit from '../../theme/assets/Edit';
import Star from '../../theme/assets/Star';

const PALETTE_COLOR_1 = '#000';
const PALETTE_COLOR_2 = '#fff';
const PALETTE_COLOR_3 = '#3b8ef3';

export default class Task extends PureComponent {
    state = {
        isTaskEditing: false,
        newMessage:    this.props.message,
    };

    messageRef = React.createRef();

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
        const input = this.messageRef.current;

        if (isTaskEditing) {
            input.disabled = !isTaskEditing;
            input.focus();
        }

        this.setState({ isTaskEditing });
    };

    _cancelUpdatingTask = () => {
        const { message } = this.props;

        this.setState({
            isTaskEditing: false,
            newMessage:    message,
        });
    };

    _updateNewTaskMessage = (evt) => {
        this.setState({ newMessage: evt.target.value });
    };

    _setTaskEditing = (id) => {
        const { isTaskEditing, newMessage } = this.state;
        const { _updateTaskAsync } = this.props;

        _updateTaskAsync(
            this._getTaskShape({ id, message: newMessage.trim() })
        );

        this._setTaskEditingState(!isTaskEditing);
    };

    _toggleTaskCompleted = (id) => {
        const { _updateTaskAsync, completed } = this.props;

        _updateTaskAsync(this._getTaskShape({ id, completed: !completed }));
    };

    _toggleTaskFavorite = (id) => {
        const { _updateTaskAsync, favorite } = this.props;

        _updateTaskAsync(this._getTaskShape({ id, favorite: !favorite }));
    };

    _updateTaskMessageOnKeyDown = (evt, id) => {
        if (evt.key === 'Enter') {
            this._setTaskEditing(id);
        } else if (evt.key === 'Escape') {
            this._cancelUpdatingTask();
        }
    };

    render () {
        const { newMessage, isTaskEditing } = this.state;

        const { id, completed, favorite, _removeTaskAsync } = this.props;

        return (
            <li className = { cx(Styles.task, { [Styles.completed]: completed }) }>
                <div className = { Styles.content }>
                    <Checkbox
                        inlineBlock
                        checked = { completed }
                        className = { Styles.toggleTaskCompletedState }
                        color1 = { PALETTE_COLOR_3 }
                        color2 = { PALETTE_COLOR_2 }
                        onClick = { () => this._toggleTaskCompleted(id) }
                    />
                    <input
                        disabled = { !isTaskEditing }
                        ref = { this.messageRef }
                        type = 'text'
                        value = { newMessage }
                        onChange = { this._updateNewTaskMessage }
                        onKeyDown = { (evt) =>
                            this._updateTaskMessageOnKeyDown(evt, id)
                        }
                    />
                </div>
                <div className = { Styles.actions }>
                    <Star
                        inlineBlock
                        checked = { favorite }
                        className = { Styles.toggleTaskFavoriteState }
                        color1 = { PALETTE_COLOR_3 }
                        color2 = { PALETTE_COLOR_1 }
                        onClick = { () => this._toggleTaskFavorite(id) }
                    />
                    <Edit
                        inlineBlock
                        checked = { false }
                        className = { Styles.updateTaskMessageOnClick }
                        color1 = { PALETTE_COLOR_3 }
                        color2 = { PALETTE_COLOR_1 }
                        onClick = { () => this._setTaskEditing(id) }
                    />
                    <Remove
                        inlineBlock
                        color1 = { PALETTE_COLOR_3 }
                        color2 = { PALETTE_COLOR_1 }
                        onClick = { _removeTaskAsync }
                    />
                </div>
            </li>
        );
    }
}
