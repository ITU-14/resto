import React, { Component } from 'react';
import { compose } from 'recompose';
import { withStyles, Paper, Card, Typography, TextField, Button, CardMedia, CardContent, CardActions } from '@material-ui/core';
import { Search, Map } from '@material-ui/icons';
import { Table, TableRow, TableFooter, TablePagination } from '@material-ui/core';
import { Link } from 'react-router-dom';
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
        display: 'flex',
        marginBottom: theme.spacing.unit,
        marginTop: theme.spacing.unit
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
            rowsPerPage: 5,

            searchName: '',
            searchTypeCuisine: ''
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

    filterList = () => {
        const { searchName , searchTypeCuisine} = this.state;
        

        this.props.firebase.restos().on('value', snapshot => {
            const restosObject = snapshot.val();
            const restosList = Object.keys(restosObject).map(key => ({
                ...restosObject[key],
                id: key
            }));

            const listeResto = [];
            restosList.forEach(resto => {
                if (resto.nom_resto.indexOf(searchName) > -1 && resto.type_cuisine.indexOf(searchTypeCuisine) > -1 )
                    listeResto.push(resto);
           //     if (resto.nom_resto.indexOf(searchTypeCuisine) > -1)
            //        listeResto.push(resto);
            });
            this.setState({
                restos: listeResto,
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

    onDropImage = () => {

    }

    render() {
        const { classes } = this.props;
        const { restos, page, rowsPerPage, searchName, searchTypeCuisine } = this.state;

        return (
            <Paper className={classes.paper}>
                <Typography component="h2" variant="h5" className={classes.searchTitle}  >
                    Recherche de restos
                </Typography>

                <br />
                <form className={classes.container}>
                    <TextField
                        id="nomResto"
                        label="Nom"
                        type="text"
                        name="searchName"
                        variant="outlined"
                        className={classes.textField1}
                        value={searchName}
                        onChange={this.onChange}
                    />

                    <TextField
                        id="typeCuisine"
                        label="Type de cuisine"
                        type="text"
                        name="searchTypeCuisine"
                        variant="outlined"
                        className={classes.textField}
                        value={searchTypeCuisine}
                        onChange={this.onChange}
                    />

                    <Button
                        variant="contained"
                        type="button"
                        color="primary"
                        className={classes.textField}
                        onClick={this.filterList}
                    >
                        <Search />
                        <Typography className={classes.searchText}>
                            Rechercher
                        </Typography>

                    </Button>
                </form>

                {restos.slice(page * rowsPerPage, (page * rowsPerPage) + rowsPerPage).map(resto => (
                    <Card className={classes.card} key={resto.id}>
                        <CardMedia
                            className={classes.cover}
                            // image="/assets/img/joystick_318-1404.jpg"
                            image={resto.photo}
                            title="Live from space album cover"
                        />
                        <CardContent className={classes.content} >
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

                        <Link to={`/fiche-resto/${resto.id}`} color="primary">
                            <Button color="primary">
                                <Map />
                                Voir la carte
                            </Button>
                        </Link>
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