import React, { Component } from 'react';
import { compose } from 'recompose';

import { withStyles, CssBaseline, IconButton, Paper, Table, TableHead, TableCell, TableRow, TableBody, TableFooter, TablePagination, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Avatar, CircularProgress } from '@material-ui/core';
import { Add, Edit } from '@material-ui/icons';

import { withFirebase } from '../Firebase';
import { withAuthorization } from '../Session';
import AppbarAdmin from './appbar-admin';
import * as ROLES from '../../constants/roles';

const styles = theme => ({
    root: {
        display: 'flex',
    },
    appBarSpacer: theme.mixins.toolbar,
    content: {
        flexGrow: 1,
        padding: theme.spacing.unit * 3,
        height: '100vh',
        overflow: 'auto',
    },
    divContainer: {
        backgroundColor: '#FFF'
    },
    chartContainer: {
        marginLeft: -22,
    },
    tableContainer: {
        height: 320
    },
    h5: {
        marginBottom: theme.spacing.unit * 2,
    },
    paperTable: {
        width: '100%',
        overflowX: 'auto'
    },
    table: {
        minWidth: 700
    },
    buttonAdd: {
        margin: theme.spacing.unit,
        float: 'right',
        backgroundColor: '#007BFF',
        '&:hover': {
            backgroundColor: '#007BBB',
        },
        color: '#FFF'
    },
    rightIcon: {
        marginLeft: theme.spacing.unit,
    },
    margin: {
        margin: theme.spacing.unit
    },
    row: {
        '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.background.default
        }
    },
    textField: {
        margin: theme.spacing.unit
    },
    textArea: {
        margin: theme.spacing.unit,
        height: "6em"
    },
    progressContainer: {
        height: `${theme.spacing.unit * 10}px`
    },
    progress: {
        margin: `${theme.spacing.unit * 3}px auto`,
        left: '50%',
        position: 'absolute'
    },
});

const INITIAL_STATE = {
    resto_id: '',
    resto_name: '',
    description: '',
    typeCuisine: '',
    address: '',
    phoneNumber: '',
    editLabel: '',
    editButton: '',
    deleteLabel: ''
};

class RestosAdminPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            open: true,
            openEditDialog: false,
            page: 0,
            restos: [],
            rowsPerPage: 10,
            ...INITIAL_STATE
        };
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

    handleOpenCreateDialog = () => {
        this.setState({
            openEditDialog: true,
            resto_id: '',
            resto_name: '',
            description: '',
            typeCuisine: '',
            address: '',
            phoneNumber: '',
            editLabel: 'Ajouter un resto',
            editButton: 'Valider'
        });
    }

    handleOpenEditDialog = (resto) => {
        this.setState({
            openEditDialog: true,
            resto_id: resto.id,
            resto_name: resto.nom_resto,
            description: resto.description,
            typeCuisine: resto.type_cuisine,
            address: resto.adresse,
            phoneNumber: resto.telephone,
            editLabel: `Modifier resto: ${resto.nom_resto}`,
            editButton: 'Modifier'
        });
    }

    saveoredit = (resto) => {
        
        let newresto = {
            adresse: document.getElementById("address").value,
            _id: '_' + Math.random().toString(36).substr(2, 9),
            latitude: "null",
            longitude: "null",
            nom_resto: document.getElementById("resto_name").value,
            photo: "",
            telephone: document.getElementById("phone").value,
            type_cuisine: "resto.type_cuisine"
        };
        this.props.firebase.restos().push(newresto);
    }

    handleCloseEditDialog = () => {
        this.setState({ openEditDialog: false });
    }


    handleChangePage = (event, page) => {
        this.setState({ page });
    }

    onChange = (event) => {
        this.setState({ [event.target.name]: event.target.value });
    }

    render() {
        // const {users, loading} = this.state;
        const { classes } = this.props;
        const { restos, page, rowsPerPage, resto_name, description, typeCuisine, address, phoneNumber, editLabel, editButton, loading } = this.state;
        const loader = <div className={classes.progressContainer}>
            <CircularProgress className={classes.progress} />
        </div>
        return (
            <div className={classes.root}>
                <CssBaseline />
                <AppbarAdmin selectedIndexInList={0} />
                <main className={classes.content}>
                    <div className={classes.appBarSpacer} />

                    <div className={classes.tableContainer}>
                        <Button variant="contained" className={classes.buttonAdd} onClick={this.handleOpenCreateDialog}>
                            Ajouter
                            <Add className={classes.rightIcon} />
                        </Button>
                        <Paper className={classes.paperTable}>
                            {loading && loader}
                            {!loading && <Table className={classes.table}>
                                <TableHead>
                                    <TableRow>
                                        <TableCell component="th">Nom</TableCell>
                                        <TableCell>Type de cuisine</TableCell>
                                        <TableCell>Adresse</TableCell>
                                        <TableCell>N<sup>o</sup> de t&eacute;l&eacute;phone</TableCell>
                                        <TableCell>Photo</TableCell>
                                        <TableCell>Options</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {restos.slice(page * rowsPerPage, (page * rowsPerPage) + rowsPerPage).map(resto => (
                                        <TableRow className={classes.row} key={resto.id}>
                                            <TableCell>{resto.nom_resto}</TableCell>
                                            <TableCell>{resto.type_cuisine}</TableCell>
                                            <TableCell>{resto.adresse}</TableCell>
                                            <TableCell>{resto.telephone}</TableCell>
                                            <TableCell>
                                                <Avatar alt={resto.nom_resto} src={resto.photo} className={classes.bigAvatar} />
                                            </TableCell>
                                            <TableCell>
                                                <IconButton size="small" color="primary" aria-label="Modifier" className={classes.margin} onClick={() => this.handleOpenEditDialog(resto)}>
                                                    <Edit />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))}

                                </TableBody>
                                <TableFooter>
                                    <TableRow>
                                        <TablePagination
                                            rowsPerPageOptions={[rowsPerPage]}
                                            colSpan={3}
                                            count={restos.length}
                                            rowsPerPage={rowsPerPage}
                                            page={page}
                                            SelectProps={{ native: true }}
                                            onChangePage={this.handleChangePage}
                                            labelDisplayedRows={({ from, to, count }) => `${from} - ${to} sur ${count} restos`}
                                            labelRowsPerPage="Lignes par page" />
                                    </TableRow>
                                </TableFooter>
                            </Table>}
                        </Paper>

                        <Dialog open={this.state.openEditDialog} onClose={this.handleCloseEditDialog} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                            <DialogTitle id="alert-dialog-title">{editLabel}</DialogTitle>
                            <DialogContent>
                                <TextField
                                    margin="normal"
                                    id="resto_name"
                                    label="Nom du resto"
                                    type="text"
                                    name="resto_name"
                                    fullWidth
                                    className={classes.textField}
                                    value={resto_name}
                                    onChange={this.onChange}
                                />

                                <TextField
                                    margin="normal"
                                    id="type-cuisine"
                                    label="Type de cuisine"
                                    type="text"
                                    fullWidth
                                    name="type-de-cuisine"
                                    className={classes.textField}
                                    value={typeCuisine}
                                    onChange={this.onChange}
                                />
                                <TextField
                                    margin="normal"
                                    id="address"
                                    label="Adresse"
                                    type="text"
                                    name="address"
                                    fullWidth
                                    className={classes.textField}
                                    value={address}
                                    onChange={this.onChange}
                                />

                                <TextField
                                    margin="normal"
                                    id="phone"
                                    name="phone"
                                    label="Numero de t&eacute;l&eacute;phone"
                                    type="text"
                                    fullWidth
                                    className={classes.textField}
                                    value={phoneNumber}
                                    onChange={this.onChange}
                                />
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={this.handleCloseEditDialog} color="default">
                                    Annuler
                                </Button>

                                <Button onClick={this.saveoredit} color="primary" autoFocus>
                                    {editButton}
                                </Button>
                            </DialogActions>
                        </Dialog>
                    </div>
                </main>
            </div>
        )
    }
}
const condition = authUser => authUser && authUser.roles.includes(ROLES.ADMIN);
export default compose(withFirebase, withAuthorization(condition), withStyles(styles))(RestosAdminPage);