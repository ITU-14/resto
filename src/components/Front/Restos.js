import React, { Component } from 'react';
import { compose } from 'recompose';
import { withStyles, Paper, Card, Typography, TextField, Button, CardMedia, CardContent, CardActions, CircularProgress } from '@material-ui/core';
import { Search, Map } from '@material-ui/icons';
import { Table, TableRow, TableFooter, TablePagination } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { withFirebase } from '../Firebase';

const styles = theme => ({
    paper: {
        width: '100%',
        overflowX: 'auto',
        textAlign: 'center',
        marginLeft: 'auto',
        marginRight: 'auto',
        paddingTop: theme.spacing.unit * 3,
        paddingBottom: theme.spacing.unit * 3
    },
    progressContainer: {
        height: `${theme.spacing.unit * 10}px`
    },
    progress: {
        margin: `${theme.spacing.unit * 3}px auto`,
        left: '50%',
        position: 'absolute'
    },
    container: {
        width: '100%',
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
    buttonSearch: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        height: '55px'
    },
    card: {
        width: '53%',
        marginLeft: 'auto',
        marginRight: 'auto',
        display: 'flex',
        marginBottom: theme.spacing.unit,
        marginTop: theme.spacing.unit
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
    content: {
        flex: '1 0 auto'
    },
    cardButton: {
        marginLeft: 'auto'
    },
    paginationColor: {
        color: '#3f51b5',
        fontWeight: '12em'
    },
    table: {
        backgroundColor: "#fafafa"
    }
});

class Restos extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            page: 0,
            restos: [],
            rowsPerPage: 10,
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
                if (resto.nom_resto.toLowerCase().indexOf(searchName.toLowerCase()) > -1 && resto.type_cuisine.toLowerCase().indexOf(searchTypeCuisine.toLowerCase()) > -1 )
                    listeResto.push(resto);
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

    handleChangePage = (event, page) => {
        this.setState({ page });
    }

    onChange = (event) => {
        this.setState({ [event.target.name]: event.target.value });
    }

    render() {
        const { classes } = this.props;
        const { restos, page, rowsPerPage, searchName, searchTypeCuisine, loading } = this.state;

        const loader = <div className={classes.progressContainer}>
            <CircularProgress className={classes.progress} />
        </div>

        const noResult = <div className={classes.progressContainer}>
            Aucun resultat
        </div>

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
                        className={classes.buttonSearch}
                        onClick={this.filterList}
                    >
                        <Search />
                        <Typography className={classes.searchText}>
                            Rechercher
                        </Typography>

                    </Button>
                </form>

                {loading && loader}
                {!loading && restos.slice(page * rowsPerPage, (page * rowsPerPage) + rowsPerPage).map(resto => (
                    <Card className={classes.card} key={resto._id}>
                        <CardMedia
                            className={classes.cover}
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

                        <Link to={`/fiche-resto/${resto._id}`} color="primary">
                            <Button color="primary">
                                <Map />
                                Voir la carte
                            </Button>
                        </Link>
                        </CardActions>
                    </Card>
                ))}

                {(!loading && restos.length > 0) && <Table className={classes.table}>
                    <TableFooter>
                        <TableRow>
                            <TablePagination
                                className={classes.paginationColor}
                                rowsPerPageOptions={[rowsPerPage]}
                                colSpan={3}
                                count={restos.length}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                SelectProps={{ native: true }}
                                onChangePage={this.handleChangePage}     
                                labelDisplayedRows={({ from, to, count }) => `Resto ${from} - ${to} sur ${count} restos (page ${page+1})`}
                                labelRowsPerPage="Lignes par page" />
                        </TableRow>
                    </TableFooter>
                </Table>}

                {!loading && restos.length === 0 && noResult}
                
            </Paper>
        );
    }
}
export default compose(withFirebase, withStyles(styles))(Restos);