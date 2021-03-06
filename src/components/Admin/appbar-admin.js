import React, { Component } from 'react';
import { compose } from 'recompose';
import classNames from 'classnames';
import { withStyles, AppBar, Toolbar, IconButton, Typography, Drawer, Divider } from '@material-ui/core';
import { Menu, ChevronLeftSharp } from '@material-ui/icons';
import SidebarAdmin from './sidebar-admin';
import SignOutButton from '../SignOut';

const drawerWidth = 240;

const styles = theme => ({
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        backgroundColor: '#007BFF'
    },
    appBarShift: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    menuButton: {
        marginLeft: 12,
        marginRight: 36,
    },
    menuButtonHidden: {
        display: 'none',
    },
    title: {
        flexGrow: 1,
    },
    drawerPaper: {
        position: 'relative',
        whiteSpace: 'nowrap',
        width: drawerWidth,
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
    toolbar: {
        paddingRight: 24, // keep right padding when drawer closed
    },
    toolbarIcon: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: '0 8px',
        ...theme.mixins.toolbar,
    },
    appBarSpacer: theme.mixins.toolbar,
    divContainer: {
        backgroundColor: '#FFF',
        borderRight: '1px solid rgba(0, 0, 0, 0.12)'
    }
});

class AppBarAdmin extends Component {

    constructor(props) {
        super(props)

        this.state = {
            open: true
        };
    }

    handleDrawerOpen = () => {
        this.setState({ open: true });
    }

    handleDrawerClose = () => {
        this.setState({ open: false });
    }

    render() {

        const { classes } = this.props;
        return (
            <div className={classes.divContainer}>
                <AppBar
                    position="absolute"
                    className={classNames(classes.appBar, this.state.open && classes.appBarShift)}
                >
                    <Toolbar disableGutters={!this.state.open} className={classes.toolbar}>
                        <IconButton color="inherit" aria-label="Open drawer" onClick={this.handleDrawerOpen} className={classNames(classes.menuButton, this.state.open && classes.menuButtonHidden)}>
                            <Menu />
                        </IconButton>

                        <Typography component="h1" variant="h6" color="inherit" noWrap className={classes.title}>
                            Au resto - B.O
                        </Typography>

                        <SignOutButton />
                    </Toolbar>
                </AppBar>

                <Drawer variant="permanent" classes={{ paper: classNames(classes.drawerPaper, !this.state.open && classes.drawerPaperClose) }} open={this.state.open}>
                    <div className={classes.toolbarIcon}>
                        <IconButton onClick={this.handleDrawerClose}>
                            <ChevronLeftSharp />
                        </IconButton>
                    </div>
                    <Divider />
                    <SidebarAdmin selectedIndexInList={this.props.selectedIndexInList} />
                </Drawer>
            </div>
        );
    }
}

const AppbarAdmin = compose(withStyles(styles))(AppBarAdmin);

export default AppbarAdmin;