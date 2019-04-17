import React, { Component } from 'react';
import MenuAppBar from '../Front/MenuAppBar';
import { compose } from 'recompose';
import { withStyles, CssBaseline} from '@material-ui/core';
// import UserOrders from '../Front/UserOrders';
import RestosDetails from '../Front/RestosDetails';
import { withAuthentication } from '../Session';

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

class DetailsResto extends Component {

    render() {
        const { idresto } = this.props.match.params;
        const {classes} = this.props;
        return (
            <div className={classes.root}>
                <CssBaseline />
                <MenuAppBar drawer={true} />
                <RestosDetails resto_id_sent={idresto} />
            </div>
        );
    }
}

/*const DetailsResto = () => (
    <div>
        
            <DetailsRestoPage/>        
        
    </div>
);*/

export default compose(withStyles(styles), withAuthentication)(DetailsResto);