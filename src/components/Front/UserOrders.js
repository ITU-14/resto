import React, { Component } from 'react';
import { Drawer, Divider, Card, CardContent, Typography, CardActions, Button, withStyles, Avatar } from '@material-ui/core';
import { Delete } from '@material-ui/icons';
import { compose } from 'recompose';
import classNames from 'classnames';

const drawerWidth = 400;

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
    noCommande: {
        textAlign: 'center',
        // padding: `${theme.spacing.unit} ${theme.spacing.unit}`,
        paddingTop: theme.spacing.unit * 2
    },
    validbutton: {
        margin: theme.spacing.unit,
        width: '45%'
    }
});

class UserOrders extends Component {
    
    render() {
        const {classes} = this.props;
        const command = true;

        const cards = (
            <div>
                <Card className={classes.card}>
                    <div className={classes.cover}>
                        <Avatar alt="Nom plat" src="/assets/img/joystick_318-1404.jpg" className={classes.bigAvatar} />
                    </div>
                    <CardContent className={classes.content}>
                        <Typography component="h6" variant="h6">
                            Poireau au poivre vert
                        </Typography>
                        <Typography variant="subtitle1" color="textSecondary">
                            Plat
                        </Typography>
                        <Typography variant="subtitle2" color="textSecondary">
                            Quantit&eacute;: 3
                        </Typography>
                        <Typography variant="subtitle2" color="textSecondary">
                            Prix unitaire: 150 Rs
                        </Typography>
                        <CardActions className={classes.cardButton}>
                            <Button color="secondary">
                                <Delete/>
                                Annuler
                            </Button>
                        </CardActions>
                    </CardContent>
                </Card>

                <Card className={classes.card}>
                    <div className={classes.cover}>
                        <Avatar alt="Nom plat" src="/assets/img/joystick_318-1404.jpg" className={classes.bigAvatar} />
                    </div>
                    <CardContent className={classes.content}>
                        <Typography component="h6" variant="h6">
                            Poireau au poivre vert
                        </Typography>
                        <Typography variant="subtitle1" color="textSecondary">
                            Plat
                        </Typography>
                        <Typography variant="subtitle2" color="textSecondary">
                            Quantit&eacute;: 3
                        </Typography>
                        <Typography variant="subtitle2" color="textSecondary">
                            Prix unitaire: 150 Rs
                        </Typography>
                        <CardActions className={classes.cardButton}>
                            <Button color="secondary">
                                <Delete/>
                                Annuler
                            </Button>
                        </CardActions>
                    </CardContent>
                </Card>

                <Divider />
                <Button variant="contained" color="secondary" className={classes.validbutton}>
                    Annuler
                </Button>
                <Button variant="contained" color="primary" className={classes.validbutton}>
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
                    Liste des commandes
                </Typography>
                <Divider />
                {command ? cards : noCards}
                
            </Drawer>
        );
    }
}

export default compose(withStyles(styles))(UserOrders);