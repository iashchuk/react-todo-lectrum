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
        isEdit:     false,
        newMessage: this.props.message,
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

    toggleEdit = (isEdit) => {
        const input = this.messageRef.current;

        if (isEdit) {
            input.disabled = !isEdit;
            input.focus();
        }

        this.setState({ isEdit });
    };

    cancelUpdateTask = () => {
        const { message } = this.props;

        this.setState({
            isEdit:     false,
            newMessage: message,
        });
    };

    onEditChange = (evt) => {
        this.setState({ newMessage: evt.target.value });
    };

    onEditClick = (id) => {
        const { isEdit, newMessage } = this.state;
        const { onUpdate } = this.props;

        onUpdate(this._getTaskShape({ id, message: newMessage.trim() }));

        this.toggleEdit(!isEdit);
    };

    onDoneClick = (id) => {
        const { onUpdate, completed } = this.props;

        onUpdate(this._getTaskShape({ id, completed: !completed }));
    };

    onFavoriteClick = (id) => {
        const { onUpdate, favorite } = this.props;

        onUpdate(this._getTaskShape({ id, favorite: !favorite }));
    };

    onKeyDown = (evt, id) => {
        if (evt.key === 'Enter') {
            this.onEditClick(id);
        } else if (evt.key === 'Escape') {
            this.cancelUpdateTask();
        }
    };

    render () {
        const { newMessage, isEdit } = this.state;

        const { id, completed, favorite, onDelete } = this.props;

        return (
            <li className = { cx(Styles.task, { [Styles.completed]: completed }) }>
                <div className = { Styles.content }>
                    <Checkbox
                        inlineBlock
                        checked = { completed }
                        className = { Styles.toggleTaskCompletedState }
                        color1 = { PALETTE_COLOR_3 }
                        color2 = { PALETTE_COLOR_2 }
                        onClick = { () => this.onDoneClick(id) }
                    />
                    <input
                        disabled = { !isEdit }
                        ref = { this.messageRef }
                        type = 'text'
                        value = { newMessage }
                        onChange = { this.onEditChange }
                        onKeyDown = { (evt) => this.onKeyDown(evt, id) }
                    />
                </div>
                <div className = { Styles.actions }>
                    <Star
                        inlineBlock
                        checked = { favorite }
                        className = { Styles.toggleTaskFavoriteState }
                        color1 = { PALETTE_COLOR_3 }
                        color2 = { PALETTE_COLOR_1 }
                        onClick = { () => this.onFavoriteClick(id) }
                    />
                    <Edit
                        inlineBlock
                        checked = { false }
                        className = { Styles.updateTaskMessageOnClick }
                        color1 = { PALETTE_COLOR_3 }
                        color2 = { PALETTE_COLOR_1 }
                        onClick = { () => this.onEditClick(id) }
                    />
                    <Remove
                        inlineBlock
                        color1 = { PALETTE_COLOR_3 }
                        color2 = { PALETTE_COLOR_1 }
                        onClick = { onDelete }
                    />
                </div>
            </li>
        );
    }
}
