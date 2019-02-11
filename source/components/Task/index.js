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

    render () {
        const {
            message,
            completed,
            favorite,
            onDelete,
            onDone,
            onFavorite,
        } = this.props;

        return (
            <li className = { cx(Styles.task, { [Styles.completed]: completed }) }>
                <div className = { Styles.content }>
                    <Checkbox
                        inlineBlock
                        checked = { completed }
                        className = { Styles.toggleTaskCompletedState }
                        color1 = { PALETTE_COLOR_3 }
                        color2 = { PALETTE_COLOR_2 }
                        onClick = { onDone }
                    />
                    <input disabled type = 'text' value = { message } />
                </div>
                <div className = { Styles.actions }>
                    <Star
                        inlineBlock
                        checked = { favorite }
                        className = { Styles.toggleTaskFavoriteState }
                        color1 = { PALETTE_COLOR_3 }
                        color2 = { PALETTE_COLOR_1 }
                        onClick = { onFavorite }
                    />
                    <Edit
                        inlineBlock
                        checked = { false }
                        className = { Styles.updateTaskMessageOnClick }
                        color1 = { PALETTE_COLOR_3 }
                        color2 = { PALETTE_COLOR_1 }
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
