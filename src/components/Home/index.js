import React, { Component } from 'react';
import MenuAppBar from '../Front/MenuAppBar';
import Restos from '../Front/Restos';
import { compose } from 'recompose';
import { withStyles, CssBaseline} from '@material-ui/core';
import UserOrders from '../Front/UserOrders';

const styles = theme => ({
    root: {
        display: 'flex',
    },
    content: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.default,
        // padding: theme.spacing.unit * 3,
    },
    toolbar: theme.mixins.toolbar
});
class HomePageResto extends Component {

    render() {
        const {classes} = this.props;
        return (
            <div className={classes.root}>
                <CssBaseline />
                <MenuAppBar />
                <main className={classes.content}>
                    <div className={classes.toolbar} />
                    <Restos />
                </main>
                <UserOrders />
            </div>
        );
    }
}

export default compose(withStyles(styles))(HomePageResto);