import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import { Restaurant, Map, RestaurantMenuOutlined } from '@material-ui/icons';

import * as ROUTES from '../../constants/routes';
import { compose } from 'recompose';

class Sidebar extends Component {

    handleSelectListItem = (event, path) => {
        this.props.history.push(path);
    }

    render() {
        return (
            <List>
                <ListItem button selected={this.props.selectedIndexInList === 0} onClick={event => this.handleSelectListItem(event, ROUTES.ADMIN_RESTOS)}>
                    <ListItemIcon>
                        <Restaurant />
                    </ListItemIcon>
                    <ListItemText primary="Restos"/>
                </ListItem>

                <ListItem button selected={this.props.selectedIndexInList === 1} onClick={event => this.handleSelectListItem(event, ROUTES.ADMIN_CARTES)}>
                    <ListItemIcon>
                        <Map />
                    </ListItemIcon>
                    <ListItemText primary="Cartes"/>
                </ListItem>

                <ListItem button selected={this.props.selectedIndexInList === 2} onClick={event => this.handleSelectListItem(event, ROUTES.ADMIN_MENUS)}>
                    <ListItemIcon>
                        <RestaurantMenuOutlined />
                    </ListItemIcon>
                    <ListItemText primary="Menus"/>
                </ListItem>
            </List>
        );
    }
}

const SidebarAdmin = compose(withRouter)(Sidebar);

export default SidebarAdmin;