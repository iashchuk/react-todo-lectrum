// Core
import React, { Component } from 'react';

// Instruments
import Styles from './styles.md.css';

export default class Spinner extends Component {
    render () {
        const { isLoading } = this.props;

        return isLoading ? <div className = { Styles.spinner } /> : null;
    }
}
