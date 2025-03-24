import React from 'react';
import { Input, Space } from 'antd';
const { Search } = Input;

function Search_bar () {
    const onSearch = (value, _e, info) => console.log(info?.source, value);
    return (
        <Search placeholder="input search text" onSearch={onSearch} enterButton size='large'/>
    )
};

export default Search_bar;

