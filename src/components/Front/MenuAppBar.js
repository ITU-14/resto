import React, { Component } from 'react';
import { withRouter } from 'react-router-dom'
import { AppBar, Toolbar, IconButton, Typography, withStyles, MenuItem, Menu, Button } from '@material-ui/core';
import { AccountCircle } from '@material-ui/icons';
import { compose } from 'recompose';
import { withFirebase } from '../Firebase';
import { AuthUserContext } from '../Session';
import * as ROUTES from '../../constants/routes';

const drawerWidth = 400;

const styles = {
    root: {
      flexGrow: 1,
    },
    appbar: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginRight: drawerWidth,
    },
    grow: {
      flexGrow: 1,
    },
    menuButton: {
      marginLeft: -12,
      marginRight: 20,
    },
};

class MenuAppBar extends Component {
    constructor(props) {
        super(props);
        this.state = {auth: true, anchorEl: null};
    }
    
    handleMenu = event => {
        this.setState({ anchorEl: event.currentTarget });
    };
    
    handleClose = () => {
        this.setState({ anchorEl: null });
    };
    
    handleLogout = () => {
        this.props.firebase.logout();
        this.setState({ anchorEl: null });
    };

    handleLogin = () => {
        this.props.history.push(ROUTES.SIGN_IN);
    }

    render() {
        const { classes } = this.props;
        const { anchorEl } = this.state;
        const open = Boolean(anchorEl);

        return (
            <AppBar position="fixed" className={classes.appbar}>
                <Toolbar>
                <Typography variant="h6" color="inherit" className={classes.grow}>
                    My resto
                </Typography>
                <AuthUserContext.Consumer>
                    {authUser => authUser ? <div>
                    <IconButton
                        aria-owns={open ? 'menu-appbar' : undefined}
                        aria-haspopup="true"
                        onClick={this.handleMenu}
                        color="inherit"
                    >
                        <AccountCircle />
                    </IconButton>
                    <Menu
                        id="menu-appbar"
                        anchorEl={anchorEl}
                        anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                        }}
                        transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                        }}
                        open={open}
                        onClose={this.handleClose}
                    >
                        <MenuItem onClick={this.handleClose}>Profile</MenuItem>
                        <MenuItem onClick={this.handleLogout}>Se d&eacute;connecter</MenuItem>
                    </Menu>
                    
                    </div> : <Button color="inherit" onClick={this.handleLogin}>Se connecter</Button>}
                </AuthUserContext.Consumer>
                
                </Toolbar>
            </AppBar>
            
        );
    }
}

export default compose(withRouter, withFirebase, withStyles(styles))(MenuAppBar);