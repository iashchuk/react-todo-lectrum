// Core
import React, { Component } from 'react';

// Instruments
import Styles from './styles.md.css';

export default class Spinner extends Component {
    render () {
        const { isSpinning } = this.props;

        return isSpinning ? <div className = { Styles.spinner } /> : null;
    }
}
