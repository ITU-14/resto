import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { AppBar, Toolbar, IconButton, Typography, withStyles, MenuItem, Menu, Button, Drawer, Divider } from '@material-ui/core';
import { AccountCircle, ChevronLeftSharp } from '@material-ui/icons';
import { compose } from 'recompose';
import { withFirebase } from '../Firebase';
import { AuthUserContext } from '../Session';
import classNames from 'classnames';
import * as ROUTES from '../../constants/routes';
import SidebarCategory from './sidebar-category';

const drawerWidth = 400;

const styles = theme => ({
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
    drawerPaper: {
        position: 'relative',
        whiteSpace: 'nowrap',
        // width: drawerWidth,
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    drawerPaperClose: {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing.unit * 7,
        [theme.breakpoints.up('sm')]: {
            width: theme.spacing.unit * 9,
        },
    },
    divContainer: {
        backgroundColor: '#FFF',
        borderRight: '1px solid rgba(0, 0, 0, 0.12)'
    }
});

class MenuAppBar extends Component {
    constructor(props) {
        super(props);
        this.state = {auth: true, anchorEl: null, open: true};
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

    handleDrawerOpen = () => {
        this.setState({open: true});
    }

    handleDrawerClose = () => {
        this.setState({open: false});
    }

    render() {
        const { classes, drawer } = this.props;
        const { anchorEl } = this.state;
        const open = Boolean(anchorEl);

        let drawerContent = drawer ? 
        <Drawer variant="permanent" classes={{paper: classNames(classes.drawerPaper, !this.state.open && classes.drawerPaperClose)}} open={this.state.open}>
            <div className={classes.toolbarIcon}>
                <IconButton onClick={this.handleDrawerClose}>
                    <ChevronLeftSharp />
                </IconButton>
            </div>
            <Divider />
            <SidebarCategory selectedIndexInList={this.props.selectedIndexInList} />
        </Drawer> : "";
        

        return (
            <div className={classes.divContainer}>
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
                {drawerContent}
            </div>
        );
    }
}

export default compose(withRouter, withFirebase, withStyles(styles))(MenuAppBar);