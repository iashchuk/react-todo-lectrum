import React, { Component, Fragment } from 'react';

// Instruments
import Styles from './styles.md.css';

// Components
import Checkbox from '../../theme/assets/Checkbox';

const PALETTE_COLOR_2 = '#fff';
const PALETTE_COLOR_6 = '#363636';

class CompleteIndicator extends Component {
    render () {
        const { isCompleteAllTasks, onCompleteAllTasks } = this.props;

        return (
            <Fragment>
                <Checkbox
                    checked = { isCompleteAllTasks() }
                    color1 = { PALETTE_COLOR_6 }
                    color2 = { PALETTE_COLOR_2 }
                    onClick = { onCompleteAllTasks }
                />
                <span className = { Styles.completeAllTasks }>
                    Все задачи выполнены
                </span>
            </Fragment>
        );
    }
}

export default CompleteIndicator;
