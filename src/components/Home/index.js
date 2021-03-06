import React, { Component } from 'react';
import Restos from '../Front/Restos';
import { compose } from 'recompose';
import { withStyles, CssBaseline } from '@material-ui/core';
import MenuAppBarHomePage from '../Front/MenuAppBarHomePage';

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
        const { classes } = this.props;

        return (
            <div className={classes.root}>
                <CssBaseline />
                <MenuAppBarHomePage />
                <main className={classes.content}>
                    <div className={classes.toolbar} />
                    <Restos />
                </main>

            </div>
        );
    }
}

export default compose(withStyles(styles))(HomePageResto);