import React, { Component } from 'react';
import { Drawer, Divider, Card, CardContent, Typography, CardActions, Button, withStyles, Avatar, FormControl, Select } from '@material-ui/core';
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
    card: {
        width: '100%',
        // maxWidth: 345,
        display: 'flex',
        marginBottom: theme.spacing.unit 
    },
    media: {
        height: 140,
    },
    cover: {
        width: 90,
        height: 'auto',
        paddingTop: theme.spacing.unit *2,
        paddingLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit  
    },
    details: {
        display: 'flex',
        flexDirection: 'column'
    },
    content: {
        flex: '1 0 auto',
        // paddingBottom: '0px !important'
    },
    cardButton: {
        float: 'right'
    },
    carteIcon: {
        paddingLeft: theme.spacing.unit,
        paddingRight: theme.spacing.unit
    },
    bigAvatar: {
        margin: 10,
        width: 80,
        height: 80,
    },
    commandName: {
        // wordBreak: 'break-word'
    },
    noCommande: {
        textAlign: 'center',
        // padding: `${theme.spacing.unit} ${theme.spacing.unit}`,
        paddingTop: theme.spacing.unit * 2
    },
    validbutton: {
        margin: theme.spacing.unit,
        width: '45%'
    },
    formControl: {
        // margin: theme.spacing.unit,
        // minWidth: 120,
    },
});

class UserOrders extends Component {

    
    handleChange = name => event => {
        this.setState({ [name]: event.target.value });
    }

    handleRemoveOrder = () => {
        /* eslint-disable */
        this.props.orders.menus.pop();
        console.log(this.props.orders);
        /* eslint-enable */
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
                    <Card className={classes.card} key={order.id}>
                        <div className={classes.cover}>
                            <Avatar alt={order.nom} src="/assets/img/joystick_318-1404.jpg" className={classes.bigAvatar} />
                        </div>
                        <CardContent className={classes.content}>
                            <Typography component="h6" variant="h6" className={classes.commandName}>
                                {order.nom}
                            </Typography>
                            <Typography variant="subtitle1" color="textSecondary">
                                {order.type}
                            </Typography>
                            
                            <Typography variant="subtitle2" color="textSecondary">
                                Prix unitaire: {order.prixUnitaire} Rs
                            </Typography>

                            <FormControl variant="filled" className={classes.formControl}>
			                    <Select
                                    native
                                    name={"order-".concat(order.id)}
                                    value={order.quantity}
                                    onChange={this.props.handleChangeQuantity}
                                >
                                    {options.map(option => (
                                        <option value={option}>{option}</option>
                                    ))}
                                </Select>
			                </FormControl>
                            
                            <CardActions className={classes.cardButton}>
                                <Button color="secondary" title="Supprimer" onClick={() => this.props.handleRemoveOrder(order.id)}>
                                    <Delete/>
                                </Button>
                            </CardActions>
                        </CardContent>
                    </Card>
                ))}

                <Divider />
                <Button variant="contained" color="secondary" className={classes.validbutton} onClick={this.props.handleCancelOrders}>
                    Annuler
                </Button>
                <Button variant="contained" color="primary" className={classes.validbutton} onClick={this.props.handleValidateOrders}>
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
                    Liste des commandes ({this.props.orders.commandes.length})
                </Typography>
                <Divider />
                {command ? cards : noCards}
                
            </Drawer>
        );
    }
}

export default compose(withStyles(styles))(UserOrders);