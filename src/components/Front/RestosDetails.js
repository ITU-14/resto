import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { withStyles, Typography, ExpansionPanel, ExpansionPanelSummary, Grid, Button, Divider, ButtonBase, CircularProgress, Snackbar } from '@material-ui/core';
import { ExpandMoreRounded, Map } from '@material-ui/icons';
import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';
import { withAuthentication } from '../Session';
import UserOrders from '../Front/UserOrders';
import SnackbarContentMessage from './SnackbarContentMessage';

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
            loadingCard: false,
            showModal: false,
            expanded: 'menu',
            menus: [],
            cartes: {plats: [], resto_id: ""},
            typePlats: [],
            page: 0,
            rowsPerPage: 5,
            orders: {
                user: JSON.parse(localStorage.getItem('authUser')),
                commandes: []
            }
        }
    }

    componentDidMount() {
        this.loadMenus();
        this.loadTypePlats();
        this.loadCards();
    }

    loadMenus() {
        this.setState({ loadingMenu: true });
        this.props.firebase.menus().orderByChild('resto_id').equalTo(this.props.resto_id_sent).on('value', snapshot => {
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

    loadTypePlats() {
        this.setState({ loadingCategory: true });
        this.props.firebase.typePlats().on('value', snapshot => {
            const categoryObject = snapshot.val();

            const categoryList = Object.keys(categoryObject).map(key => ({
                ...categoryObject[key],
                id: key
            }));
            this.setState({
                typePlats: categoryList,
                loadingCategory: false
            });
        });
    }

    loadCards() {
        this.setState({ loadingCard: true });
        this.props.firebase.cartes().orderByChild('resto_id').equalTo(this.props.resto_id_sent).on('value', snapshot => {
            const cardsObject = snapshot.val();
            const cardsList = Object.keys(cardsObject).map(key => ({
                ...cardsObject[key],
                id: key
            }));
            this.setState({
                cartes: (cardsList.length > 0) ? cardsList[0] : {plats: [], resto_id: ""},
                loadingCard: false
            });
        });
    }

    componentWillUnmount() {
        this.props.firebase.restos().off();
        this.props.firebase.menus().off();
        this.props.firebase.cartes().off();
        this.props.firebase.typePlats().off();
        this.props.firebase.orders().off();
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
        const orders = this.state.orders;
        this.props.firebase.orders().push(orders);
        orders.commandes = [];
        this.setState({orders: orders, showModal: true});
    }

    handleCloseDialog = () => {
        this.setState({showModal: false})
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
                prixUnitaire: menu.prix,
                quantity: 1,
                photo: menu.photo ? menu.photo : menu.photo_plat
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
                    <span key={content.label.concat(menu._id)}><b className={className}>{content.label}</b>: <i>{content.nom}</i><br/></span>
                ))}
            </Typography>
        );
    }

    renderPlatItem(plat, classes) {
        return (
            <div className={classes.item} key={`plat-${plat._id}`}>
                <div className={classes.section1}>
                    <Grid container spacing={16}>
                        <Grid item>
                            <ButtonBase className={classes.media}>
                                <img className={classes.img} 
                                        alt={plat.nom} 
                                        src={plat.photo_plat} />
                            </ButtonBase>
                        </Grid>
                        <Grid item xs={12} sm container>
                            <Grid item xs container direction="column" spacing={16}>
                                <Grid item xs>
                                    <Typography variant="h5">
                                        {plat.nom}
                                    </Typography>
                                    <Typography color="textSecondary">
                                        {plat.description_plat}
                                    </Typography>
                                </Grid>

                                <Grid item>
                                    <Button color="primary" onClick={() => this.addCommande(plat, 'Plat')}>
                                        <Map />
                                        Commander
                                    </Button>
                                </Grid>
                            </Grid>
                        </Grid>
                        
                        <Grid item>
                            <Typography variant="h6">
                            Rs. {plat.prix}
                            </Typography>
                        </Grid>
                    </Grid>
                </div>
                <Divider />
            </div>
        );
    }

    render() {
        const { classes } = this.props;
        const { menus, typePlats, cartes, expanded, loadingMenu, loadingCategory, loadingCard, showModal} = this.state;

        const loader = <div className={classes.progressContainer}>
            <CircularProgress className={classes.progress} />
        </div>
        return (
            <div className={classes.divContainer}>
                <main className={classes.maincontent}>
                    <div className={classes.toolbar} />

                    <ExpansionPanel expanded={expanded === 'menu'}
                                    onChange={this.handleExpand('menu')}
                                    id={'menu'}>
                        <ExpansionPanelSummary  className={classes.headingContainer}
                                                expandIcon={<ExpandMoreRounded />}>
                            <Typography className={classes.heading}>Menus {menus.length > 0 && `(${menus.length})`}</Typography>
                        </ExpansionPanelSummary>
                        
                        {loadingMenu && loader}
                        {menus.map(menu => (

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
                                            Rs. {menu.prix}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </div>
                                <Divider />
                            </div>
                        ))}
                        
                    </ExpansionPanel>

                    {loadingCategory && loader}     
                    {!loadingCategory && typePlats.map(category => (
                        <ExpansionPanel expanded={expanded === 'plat-details-'.concat(category.id)}
                                        onChange={this.handleExpand('plat-details-'.concat(category.id))}
                                        key={`typePlat-`.concat(category.id)}>
                            <ExpansionPanelSummary  className={classes.headingContainer}
                                                    expandIcon={<ExpandMoreRounded />}>
                                <Typography className={classes.heading}>{category.nom}</Typography>
                            </ExpansionPanelSummary>
                            
                            {loadingCard && loader}
                            {cartes.plats.filter(platCarte => {return platCarte.type_plat.toLowerCase().localeCompare(category.nom.toLowerCase())===0 }).map(plat => (
                                this.renderPlatItem(plat, classes)
                            ))}
                            
                        </ExpansionPanel>
                    ))}
                    
                </main>
                
                <Snackbar anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'left',
                        }}
                        open={showModal}
                        autoHideDuration={8000}
                        onClose={this.handleCloseDialog}
                >
                <SnackbarContentMessage
                    onClose={this.handleCloseDialog}
                    message="OK, nous preparons votre commande!"
                />
                </Snackbar>

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