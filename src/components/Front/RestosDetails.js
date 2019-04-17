import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { withStyles, Paper, Card, Typography, Button, CardMedia, CardContent, CardActions } from '@material-ui/core';
import {  Map } from '@material-ui/icons';
import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';
import { withAuthentication } from '../Session';
import UserOrders from '../Front/UserOrders';
import { Table, TableRow, TableFooter, TablePagination } from '@material-ui/core';

const styles = theme => ({
    paper: {
        // width: '100%',
        // flexShrink: 0,
        // color: theme.palette.text.secondary,
        overflowX: 'auto',
        textAlign: 'center',
        paddingTop: theme.spacing.unit * 3,
        paddingBottom: theme.spacing.unit * 3
    },
    divContainer: {
        width: '58%',
        margin: '8px 7px'
    },
    toolbar: theme.mixins.toolbar,
    container: {
        display: 'flex',
        flexWrap: 'wrap',
        width: '68%',
        marginLeft: 'auto',
        marginRight: 'auto',
        marginBottom: theme.spacing.unit * 3,
        paddingLeft: theme.spacing.unit * 8,
        paddingRight: theme.spacing.unit * 3
    },
    textField1: {
        marginRight: theme.spacing.unit,
    },
    textField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
    },
    card: {
        width: '53%',
        marginLeft: 'auto',
        marginRight: 'auto',
        // maxWidth: 345,
        display: 'flex'
    },
    media: {
        height: 140,
    },
    searchText: {
        marginLeft: '7px',
        color: '#FFF'
    },
    cover: {
        width: 150,
        height: 'auto',
        paddingTop: theme.spacing.unit,
        paddingLeft: theme.spacing.unit,
        paddingBottom: theme.spacing.unit,
        paddingRight: theme.spacing.unit
    },
    details: {
        display: 'flex',
        flexDirection: 'column'
    },
    content: {
        flex: '1 0 auto'
    },
    maincontent: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.default,
        width: '100%'
        // padding: theme.spacing.unit * 3,
    },
    cardButton: {
        marginLeft: 'auto'
    },
    carteIcon: {
        paddingLeft: theme.spacing.unit,
        paddingRight: theme.spacing.unit
    }
});

class RestosDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            test: true,
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
        this.setState({ loading: true });
        this.props.firebase.menus().on('value', snapshot => {
            const menuObject = snapshot.val();
            const menuList = Object.keys(menuObject).map(key => ({
                ...menuObject[key],
                id: key
            }));

            this.setState({
                menus: menuList,
                loading: false
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
                loading: false
            });
        });
    }

    componentWillUnmount() {
        this.props.firebase.restos().off();
    }

    handleOpenDeleteDialog = () => {
        this.setState({ openDeleteDialog: true });
    }

    handleOpenEditDialog = () => {
        this.setState({ openEditDialog: true });
    }

    handleCloseEditDialog = () => {
        this.setState({ openEditDialog: false });
    }

    handleCloseDeleteDialog = () => {
        this.setState({ openDeleteDialog: false });
    }

    handleChangePage = (event, page) => {
        this.setState({ page });
    }

    handleChangeRowsPerPage = (event) => {
        this.setState({ page: 0, rowsPerPage: event.target.value });
    }

    onChange = (event) => {
        this.setState({ [event.target.name]: event.target.value });
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
        const value = event.target.value;
        
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

    addCommande = (menu) => {
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
                nom: "Test Nom menu lava",
                type: "Plat",
                prixUnitaire: 150,
                quantity: 1,
                image: "/assets/img/joystick_318-1404.jpg"
            });
        }
        this.setState({
            orders: oldOrders
        });
    }

    render() {
        const { classes, resto_id_sent } = this.props;
        const { menus, page, rowsPerPage } = this.state;
        let menuList = menus.filter(menu => {
            return menu.resto_id === resto_id_sent;
        });

        
        return (
            <div className={classes.divContainer}>
                <main className={classes.maincontent}>
                    <div className={classes.toolbar} />
                    <Paper className={classes.paper}>
                        {menuList.slice(page * rowsPerPage, (page * rowsPerPage) + rowsPerPage).map(menu => (
                            <Card className={classes.card} key={menu.id}>
                                <CardMedia
                                    className={classes.cover}
                                    image="/assets/img/joystick_318-1404.jpg"
                                    title="Live from space album cover"
                                />

                                <CardContent className={classes.content}>
                                    <Typography component="h5" variant="h5">
                                        {menu.nom_menu}
                                    </Typography>
                                    <Typography variant="subtitle1" color="textSecondary">
                                        {menu.prix_menu}
                                    </Typography>
                                    <Typography variant="subtitle2" color="textSecondary">
                                        {menu.resto_id}
                                    </Typography>
                                    <Typography variant="subtitle2" color="textSecondary">
                                        id :  {menu.id}
                                    </Typography>
                                </CardContent>
                                <CardActions className={classes.cardButton}>
                                    <Button color="primary" onClick={() => this.addCommande(menu)}>
                                        <Map />
                                        Commander
                                </Button>
                                </CardActions>
                            </Card>
                        ))}
                        <Table className={classes.table}>
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
                        </Table>
                    </Paper>
                </main>
                
                <UserOrders orders={this.state.orders} 
                            handleRemoveOrder={this.handleRemoveOrder} 
                            handleChangeQuantity={this.handleChangeQuantity} 
                            handleValidateOrders={this.handleValidateOrders}/>

            </div>
        );
    }
}

export default compose(withFirebase, withRouter, withAuthentication, withStyles(styles))(RestosDetails);