import React, { Component } from 'react';
import { compose } from 'recompose';
import { withStyles, Paper, Card, Typography, Button, CardMedia, CardContent, CardActions } from '@material-ui/core';
import { Map } from '@material-ui/icons';

const styles = theme => ({
    paper: {
        width: '100%',
        // flexShrink: 0,
        //color: theme.palette.text.secondary,
        overflowX: 'auto',
        textAlign: 'center',
        paddingTop: theme.spacing.unit * 3,
        paddingBottom: theme.spacing.unit * 3
    },
    
    container: {
        display: 'flex',
        flexWrap: 'wrap',
        width: '68%',
        marginLeft: 'auto',
        marginRight: 'auto',
        marginBottom: theme.spacing.unit * 3,
        paddingLeft: theme.spacing.unit *8,
        paddingRight: theme.spacing.unit *3
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
            test: true
        }
    }

    render() {
        const {classes} = this.props;

        return (
            <Paper className={classes.paper}>
                <Card className={classes.card}>
                    <CardMedia
                        className={classes.cover}
                        image="/assets/img/joystick_318-1404.jpg"
                        title="Live from space album cover"
                    />
                    
                    <CardContent className={classes.content}>
                        <Typography component="h5" variant="h5">
                            Jean's Resto
                        </Typography>
                        <Typography variant="subtitle1" color="textSecondary">
                            Cuisine chinoise
                        </Typography>
                        <Typography variant="subtitle2" color="textSecondary">
                            St.Jean Road, Quatres Bornes
                        </Typography>
                        <Typography variant="subtitle2" color="textSecondary">
                        +230 5874 9695
                        </Typography>
                    </CardContent>
                    <CardActions className={classes.cardButton}>
                        <Button color="primary">
                            <Map/>
                            Commander
                        </Button>
                    </CardActions>
                </Card>
            </Paper>
        );
    }
}

export default compose(withStyles(styles))(RestosDetails);