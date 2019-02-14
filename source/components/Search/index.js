import React, { Component } from 'react';

class Search extends Component {
    state = {
        term: '',
    };

    onChange = (evt) => {
        const term = evt.target.value;

        this.setState({
            term,
        });
        this.props.onSearchChange(term);
    };

    render () {
        const searchText = 'Поиск';

        return (
            <input
                placeholder = { searchText }
                type = 'text'
                value = { this.state.term }
                onChange = { this.onChange }
            />
        );
    }
}

export default Search;
