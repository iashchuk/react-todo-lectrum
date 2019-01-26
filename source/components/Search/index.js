import React, { Component } from 'react';

class Search extends Component {
    render () {
        const searchText = 'Поиск';

        return <input placeholder = { searchText } type = 'search' />;
    }
}

export default Search;
