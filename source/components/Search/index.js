import React, { Component } from 'react';

class Search extends Component {
    render () {
        const searchText = 'Поиск';
        const { tasksFilter, _updateTasksFilter } = this.props;

        return (
            <input
                placeholder = { searchText }
                type = 'search'
                value = { tasksFilter }
                onChange = { _updateTasksFilter }
            />
        );
    }
}

export default Search;
