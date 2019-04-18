import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { withStyles, Typography, ExpansionPanel, ExpansionPanelSummary, Grid, Button, Divider, ButtonBase, CircularProgress } from '@material-ui/core';
import {   ExpandMoreRounded, Map } from '@material-ui/icons';
import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';
import { withAuthentication } from '../Session';
import UserOrders from '../Front/UserOrders';
import { Table, TableRow, TableFooter, TablePagination } from '@material-ui/core';

const styles = theme => ({
    divContainer: {
        width: '65%',
        margin: `${theme.spacing.unit}px ${theme.spacing.unit * 3}px`
    },
    section1: {
        margin: `${theme.spacing.unit * 3}px ${theme.spacing.unit * 2}px`,
    },
    toolbar: theme.mixins.toolbar,
    media: {
        height: 140,
        width: 140
    },
    img: {
        margin: 'auto',
        display: 'block',
        maxWidth: '100%',
        maxHeight: '100%'
    },
    maincontent: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.default,
        width: '100%'
    },
    item: {
        margin: `${theme.spacing.unit}px`,
    },
    heading: {
        fontSize: theme.typography.pxToRem(15),
        fontWeight: theme.typography.fontWeightRegular,
    },
    headingContainer: {
        backgroundColor: 'rgba(0,0,0,.03)',
        borderBottom: '1px solid #fafafa'
    },
    progressContainer: {
        height: `${theme.spacing.unit * 10}px`
    },
    progress: {
        margin: `${theme.spacing.unit * 3}px auto`,
        left: '50%',
        position: 'absolute'
    },
    category: {
        '&:first-letter': {
            textTransform: 'Uppercase'
        }
    }
});

class RestosDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loadingMenu: false,
            expanded: 'menu',
            menus: [],
            page: 0,
            rowsPerPage: 5,
            id_resto: '',
            authUser: JSON.parse(localStorage.getItem('authUser')),
            orders: {
                user: JSON.parse(localStorage.getItem('authUser')),
                commandes: []
            }
        }
    }

    componentDidMount() {
        this.setState({ loadingMenu: true });
        this.props.firebase.menus().on('value', snapshot => {
            const menuObject = snapshot.val();
            const menuList = Object.keys(menuObject).map(key => ({
                ...menuObject[key],
                id: key
            }));

            this.setState({
                menus: menuList,
                loadingMenu: false
            });
        });
    }

    filterList = () => {
        const { id_resto } = this.state;
        this.props.firebase.menus().on('value', snapshot => {
            const menuObject = snapshot.val();
            const menuList = Object.keys(menuObject).map(key => ({
                ...menuObject[key],
                id: key
            }));

            const listeMenu = [];
            menuList.forEach(menu => {
                if (menu.resto_id.indexOf(id_resto) > -1)
                    listeMenu.push(menu);
            });
            this.setState({
                menus: listeMenu,
                loadingMenu: false
            });
        });
    }

    componentWillUnmount() {
        this.props.firebase.restos().off();
    }


    handleChangePage = (event, page) => {
        this.setState({ page });
    }

    handleChangeRowsPerPage = (event) => {
        this.setState({ page: 0, rowsPerPage: event.target.value });
    }

    handleRemoveOrder = (menu_id) => {
        let orders = this.state.orders;
        orders.commandes = orders.commandes.filter(order => {
            return (order.id.localeCompare(menu_id) !== 0);
        });
        this.setState({
            orders: orders
        });
    }

    handleChangeQuantity = (event) => {
        let orders = this.state.orders;
        const id = event.target.name.split("-")[1];
        const value = parseInt(event.target.value, 10);
        
        orders.commandes.forEach(order => {
            if(order.id === id) {
                order.quantity = value;
                return;
            }
        });
        orders.commandes = orders.commandes.filter(order => {
            return (order.quantity > 0);
        });
        this.setState({
            orders: orders
        });
    }

    handleValidateOrders = () => {

    }

    handleCancelOrders = () => {
        let orders = this.state.orders;
        orders.commandes = [];
        this.setState({
            orders: orders
        });
    }

    addCommande = (menu, typeOrder) => {
        const user = JSON.parse(localStorage.getItem('authUser'));
        console.log(user);
        if(!user) {
            this.props.history.push(ROUTES.SIGN_IN);
        }
        let oldOrders = this.state.orders;
        let statusAdded = false;
        oldOrders.commandes.forEach(order => {
            if(order.id.localeCompare(menu._id) === 0) {
                statusAdded = true;
                order.quantity += 1;
                return;
            }
        });
        if(!statusAdded) {
            oldOrders.commandes.push({
                id: menu._id,
                nom: menu.nom,
                type: typeOrder,
                prixUnitaire: menu.prix_menu,
                quantity: 1,
                photo: menu.photo
            });
        }
        this.setState({
            orders: oldOrders
        });
    }

    handleExpand = panel => (event, expanded) => {
        this.setState({
            expanded: expanded ? panel : false
        });
    }

    renderContentMenu = (menu, className) => {
        let contents = menu.contents;
        let data = [];
        contents.forEach(content => {
            let dataContent = {label: content.typePlat, nom: ""};
            content.listePlats.forEach(plat => {
                dataContent.nom += plat.nom;
            });
            data.push(dataContent);
        });
        return (
            <Typography color="textSecondary">
                {data.map(content => (
                    <p key={content.id}><b className={className}>{content.label}</b>: <i>{content.nom}</i></p>
                ))}
            </Typography>
        );
    }

    render() {
        const { classes, resto_id_sent } = this.props;
        const { menus, page, rowsPerPage, expanded, loadingMenu } = this.state;
        let menuList = menus.filter(menu => {
            return menu.resto_id === resto_id_sent;
        });

        const loader = <div className={classes.progressContainer}>
            <CircularProgress className={classes.progress} />
        </div>

        return (
            <div className={classes.divContainer}>
                <main className={classes.maincontent}>
                    <div className={classes.toolbar} />

                    <ExpansionPanel expanded={expanded === 'menu'}
                                    onChange={this.handleExpand('menu')}>
                        <ExpansionPanelSummary  className={classes.headingContainer}
                                                expandIcon={<ExpandMoreRounded />}>
                            <Typography className={classes.heading}>Menus {menuList.length > 0 && `(${menuList.length})`}</Typography>
                        </ExpansionPanelSummary>
                        
                            {loadingMenu && loader}
                            {menuList.slice(page * rowsPerPage, (page * rowsPerPage) + rowsPerPage).map(menu => (

                                <div className={classes.item} key={`menu-${menu.id}`}>
                                    <div className={classes.section1}>
                                        <Grid container spacing={16}>
                                            <Grid item>
                                                <ButtonBase className={classes.media}>
                                                    <img className={classes.img} 
                                                            alt={menu.nom} 
                                                            src={menu.photo} />
                                                </ButtonBase>
                                            </Grid>
                                            <Grid item xs={12} sm container>
                                                <Grid item xs container direction="column" spacing={16}>
                                                    <Grid item xs>
                                                        <Typography variant="h5">
                                                            {menu.nom}
                                                        </Typography>
                                                        {this.renderContentMenu(menu, classes.category)}
                                                    </Grid>

                                                    <Grid item>
                                                        <Button color="primary" onClick={() => this.addCommande(menu, 'Menu')}>
                                                            <Map />
                                                            Commander
                                                        </Button>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                            
                                            <Grid item>
                                                <Typography variant="h6">
                                                Rs. {menu.prix_menu}
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    </div>
                                    <Divider />
                                </div>
                            ))}
                            {!loadingMenu && <Table className={classes.table}>
                                <TableFooter>
                                    <TableRow>
                                        <TablePagination
                                            rowsPerPageOptions={[5, 10, 25]}
                                            colSpan={3}
                                            count={menuList.length}
                                            rowsPerPage={rowsPerPage}
                                            page={page}
                                            SelectProps={{ native: true }}
                                            onChangePage={this.handleChangePage}
                                            onChangeRowsPerPage={this.handleChangeRowsPerPage}
                                            labelDisplayedRows={({ from, to, count }) => `${from} - ${to} sur ${count} restos`}
                                            labelRowsPerPage="Lignes par page" />
                                    </TableRow>
                                </TableFooter>
                            </Table>}
                    </ExpansionPanel>
                        
                    
                </main>
                
                <UserOrders orders={this.state.orders} 
                            handleRemoveOrder={this.handleRemoveOrder} 
                            handleChangeQuantity={this.handleChangeQuantity} 
                            handleValidateOrders={this.handleValidateOrders}
                            handleCancelOrders={this.handleCancelOrders}/>

            </div>
        );
    }
}

export default compose(withFirebase, withRouter, withAuthentication, withStyles(styles))(RestosDetails);