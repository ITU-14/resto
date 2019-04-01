import React from 'react';

function Menu(props) {
    return <li onClick={() => props.deleteMenu(props.name)}>{props.name}</li>
}

export default Menu;