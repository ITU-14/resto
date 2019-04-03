import React, { Component } from 'react';
import { compose } from 'recompose';
import { withStyles, Paper, Card, Typography, TextField, Button, CardMedia, CardContent, CardActions } from '@material-ui/core';
import { Search, Map } from '@material-ui/icons';
import { IconButton, Table, TableHead, TableCell, TableRow, TableBody, TableFooter, TablePagination } from '@material-ui/core';
import { Edit, Delete } from '@material-ui/icons';

import { withFirebase } from '../Firebase';

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
    cardButton: {
        marginLeft: 'auto'
    },
    carteIcon: {
        paddingLeft: theme.spacing.unit,
        paddingRight: theme.spacing.unit
    }
});

class Restos extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            open: true,
            selectedIndexInList: 0,
            openDeleteDialog: false,
            openEditDialog: false,
            page: 0,
            restos: [],
            rowsPerPage: 5
        }
    }
    componentDidMount() {
        this.setState({ loading: true });
        this.props.firebase.restos().on('value', snapshot => {
            const restosObject = snapshot.val();
            const restosList = Object.keys(restosObject).map(key => ({
                ...restosObject[key],
                id: key
            }));
            this.setState({
                restos: restosList,
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

    onDropImage = () => {

    }

    render() {
        const { classes } = this.props;
        const { restos, page, rowsPerPage } = this.state;
        return (
            <Paper className={classes.paper}>
                <Typography component="h2" variant="h5" className={classes.searchTitle}>
                    Recherche de restos
                </Typography>

                <br />
                <form className={classes.container}>
                    <TextField
                        id="nomResto"
                        label="Nom"
                        type="text"
                        name="nomResto"
                        variant="outlined"
                        className={classes.textField1}
                    />

                    <TextField
                        id="typeCuisine"
                        label="Type de cuisine"
                        type="text"
                        name="typeCuisine"
                        variant="outlined"
                        className={classes.textField}
                    />

                    <Button
                        variant="contained"
                        type="submit"
                        color="primary"
                        className={classes.textField}
                    >
                        <Search />
                        <Typography className={classes.searchText}>
                            Rechercher
                        </Typography>

                    </Button>
                </form>
                {restos.slice(page * rowsPerPage, (page * rowsPerPage) + rowsPerPage).map(resto => (
                    
                <Card className={classes.card} >
                  

                        <CardMedia
                            className={classes.cover}
                            image="/assets/img/joystick_318-1404.jpg"
                            title="Live from space album cover"
                        />

                        
                 
                        <CardContent className={classes.content}>
                            <Typography component="h5" variant="h5">
                            {resto.nom_resto}
                        </Typography>
                            <Typography variant="subtitle1" color="textSecondary">
                            {resto.type_cuisine}
                        </Typography>
                            <Typography variant="subtitle2" color="textSecondary">
                            {resto.adresse}
                        </Typography>
                            <Typography variant="subtitle2" color="textSecondary">
                            {resto.telephone}
                        </Typography>
                        </CardContent>
                        <CardActions className={classes.cardButton}>
                            <Button color="primary">
                                <Map />
                                Voir la carte
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
                                count={restos.length}
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
        );
    }
}
export default compose(withFirebase, withStyles(styles))(Restos);