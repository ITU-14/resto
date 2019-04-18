import React, { Component } from 'react';
import { Drawer, Divider, Typography, Button, withStyles, FormControl, Select, Grid, ButtonBase } from '@material-ui/core';
import { Delete } from '@material-ui/icons';
import { compose } from 'recompose';
import classNames from 'classnames';

const drawerWidth = '30%';

const styles = theme => ({
    toolbar: theme.mixins.toolbar,
    toolbarText: {
        textAlign: 'center',
        paddingTop: theme.spacing.unit * 2,
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
    },
    drawerPaper: {
        width: drawerWidth,
    },
    item: {
        margin: `${theme.spacing.unit}px`,
    },
    media: {
        height: 75,
        width: 75
    },
    img: {
        margin: 'auto',
        display: 'block',
        maxWidth: '100%',
        maxHeight: '100%'
    },
    noCommande: {
        textAlign: 'center',
        paddingTop: theme.spacing.unit * 2
    },
    validbutton: {
        margin: theme.spacing.unit,
        width: '45%'
    },
    section1: {
        margin: `${theme.spacing.unit * 3}px ${theme.spacing.unit * 2}px`,
    }
});

class UserOrders extends Component {
    
    handleChange = name => event => {
        this.setState({ [name]: event.target.value });
    }

    calculatePrix = () => {
        const orders = this.props.orders;
        let somme = 0;
        let quantity = 0;
        orders.commandes.forEach(order => {
            somme = parseFloat(somme) + parseFloat(order.prixUnitaire * order.quantity);
            quantity = parseFloat(quantity) + parseFloat(order.quantity);
        });
        return { somme: somme.toFixed(2), quantity: quantity};
    }

    render() {
        const {classes, orders} = this.props;
        const command = orders.commandes.length > 0;
        const options = [];
        for(let k = 0; k < 30;k++) {
            options[k] = k+1;
        }
        const cards = (
            <div>
                {orders.commandes.map(order => (
                    <div className={classes.item} key={`order-${order.id}`}>
                        <div className={classes.section1}>
                            <Grid container spacing={16}>
                                <Grid item>
                                    <ButtonBase className={classes.media}>
                                        <img className={classes.img} 
                                                alt={"complex"} 
                                                src={"/assets/img/joystick_318-1404.jpg"} />
                                    </ButtonBase>
                                </Grid>
                                <Grid item xs={12} sm container>
                                    <Grid item xs container direction="column" spacing={16}>
                                        <Grid item xs>
                                            <Typography variant="h6">
                                                {order.nom}
                                            </Typography>
                                            <Typography variant="subtitle2" color="textSecondary">
                                                Prix unitaire: Rs {order.prixUnitaire}
                                            </Typography>
                                            <FormControl variant="filled">
                                                <Select
                                                    native
                                                    name={"order-".concat(order.id)}
                                                    value={order.quantity}
                                                    onChange={this.props.handleChangeQuantity}
                                                >
                                                    {options.map(option => (
                                                        <option value={option} key={`option-${order.id}-${option}`}>{option}</option>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                
                                <Grid item>
                                    <Button color="secondary" title="Supprimer" onClick={() => this.props.handleRemoveOrder(order.id)}>
                                        <Delete />
                                    </Button>
                                </Grid>
                            </Grid>
                        </div>
                        <Divider />
                    </div>
                ))}

                <Divider />
                <Button variant="contained" 
                        color="secondary" 
                        className={classes.validbutton} 
                        onClick={this.props.handleCancelOrders}>
                    Annuler
                </Button>
                <Button variant="contained" 
                        color="primary" 
                        className={classes.validbutton} 
                        onClick={this.props.handleValidateOrders}>
                    Valider
                </Button>
            </div>
        );

        const noCards = (
            <Typography component="h5" variant="h5" className={classes.noCommande}>
                Aucune commande
            </Typography>
        );

        // const toolbarTest = (<div className={classes.toolbar} />);

        return (
            <Drawer
                    className={classes.drawer}
                    variant="permanent"
                    classes={{
                        paper: classes.drawerPaper,
                    }}
                    anchor="right"
                >
                <Typography component="h6" variant="h6" className={classNames(classes.toolbar, classes.toolbarText)}>
                    Commandes {this.props.orders.commandes.length> 0 && `(${this.calculatePrix().quantity}) - Rs. ${this.calculatePrix().somme}`}
                </Typography>
                <Divider />
                {command ? cards : noCards}
                
            </Drawer>
        );
    }
}

export default compose(withStyles(styles))(UserOrders);