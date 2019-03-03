import React, { Component, Fragment } from 'react';

// Instruments
import Styles from './styles.md.css';

// Components
import Checkbox from '../../theme/assets/Checkbox';

const PALETTE_COLOR_2 = '#fff';
const PALETTE_COLOR_6 = '#363636';

class CompleteIndicator extends Component {
    render () {
        const { _getAllCompleted, _completeAllTasksAsync } = this.props;

        return (
            <Fragment>
                <Checkbox
                    checked = { _getAllCompleted() }
                    color1 = { PALETTE_COLOR_6 }
                    color2 = { PALETTE_COLOR_2 }
                    onClick = { _completeAllTasksAsync }
                />
                <span className = { Styles.completeAllTasks }>
                    Все задачи выполнены
                </span>
            </Fragment>
        );
    }
}

export default CompleteIndicator;
