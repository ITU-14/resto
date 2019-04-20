import React, { Component } from 'react';
import { compose } from 'recompose';

import { withStyles, CssBaseline, IconButton, Paper, Table, TableHead, TableCell, TableRow, TableBody, TableFooter, TablePagination, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Avatar, CircularProgress, Snackbar, Typography } from '@material-ui/core';
import { Add, Edit } from '@material-ui/icons';

import { withFirebase } from '../Firebase';
import { withAuthorization } from '../Session';
import AppbarAdmin from './appbar-admin';
import * as ROLES from '../../constants/roles';
import SnackbarContentMessage from '../Front/SnackbarContentMessage';

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
            restoEdit: {
                _id: '',
                nom_resto: '',
                type_cuisine: '',
                adresse: '',
                telephone: '',
                longitude: '',
                latitude: '',
                photo: '/assets/img/default-resto.png'
            },
            showModal: false,
            messageSnackBar: '',
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

    initResto() {
        return {
            _id: '',
            nom_resto: '',
            type_cuisine: '',
            adresse: '',
            telephone: '',
            longitude: '',
            latitude: '',
            photo: '/assets/img/default-resto.png'
        }
    }

    handleCloseDialog = () => {
        this.setState({ showModal: false })
    }

    handleOpenCreateDialog = () => {
        const restoNew = this.initResto();
        this.setState({
            openEditDialog: true,
            restoEdit: restoNew,
            editLabel: 'Ajouter un resto',
            editButton: 'Valider'
        });
    }

    handleOpenEditDialog = (resto) => {
        this.setState({
            openEditDialog: true,
            restoEdit: resto,
            editLabel: `Modifier resto: ${resto.nom_resto}`,
            editButton: 'Modifier'
        });
    }

    saveoredit = () => {
        const restoToEdit = this.state.restoEdit;
        if (restoToEdit._id.localeCompare("") === 0) {
            restoToEdit._id = '_'.concat(Math.random().toString(36).substr(2, 9));
            this.props.firebase.restos().push(restoToEdit);
            this.setState({ openEditDialog: false, showModal: true, messageSnackBar: "Resto ajouté avec succès! Elle se trouve à la dernière page" });
        } else {
            this.props.firebase.resto(restoToEdit.id).update(restoToEdit);
            this.setState({ openEditDialog: false, showModal: true, messageSnackBar: "Votre modification a été enregistré!" });
        }
    }

    handleCloseEditDialog = () => {
        this.setState({ openEditDialog: false });
    }

    handleChangePage = (event, page) => {
        this.setState({ page });
    }

    onChange = (event) => {
        let restoToEdit = this.state.restoEdit;
        restoToEdit[event.target.name] = event.target.value;
        this.setState({ restoEdit: restoToEdit });
    }

    render() {
        // const {users, loading} = this.state;
        /* eslint-disable */
        const { classes } = this.props;
        const { restos, page, rowsPerPage, editLabel, editButton, loading, restoEdit, messageSnackBar, showModal } = this.state;
        const loader = <div className={classes.progressContainer}>
            <CircularProgress className={classes.progress} />
        </div>
        /* eslint-enable */
        return (
            <div className={classes.root}>
                <CssBaseline />
                <AppbarAdmin selectedIndexInList={0} />
                <main className={classes.content}>
                    <div className={classes.appBarSpacer} />

                    <div className={classes.tableContainer}>
                        <Typography variant="h5">
                            Liste des restos (pagin&eacute;e)
                        </Typography>
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
                                <input type="hidden" name="_id" value={restoEdit._id} />
                                <TextField
                                    margin="normal"
                                    label="Nom du resto"
                                    type="text"
                                    name="nom_resto"
                                    fullWidth
                                    className={classes.textField}
                                    value={restoEdit.nom_resto}
                                    onChange={this.onChange}
                                />

                                <TextField
                                    margin="normal"
                                    label="Type de cuisine"
                                    type="text"
                                    fullWidth
                                    name="type_cuisine"
                                    className={classes.textField}
                                    value={restoEdit.type_cuisine}
                                    onChange={this.onChange}
                                />
                                <TextField
                                    margin="normal"
                                    label="Adresse"
                                    type="text"
                                    name="adresse"
                                    fullWidth
                                    className={classes.textField}
                                    value={restoEdit.adresse}
                                    onChange={this.onChange}
                                />

                                <TextField
                                    margin="normal"
                                    name="telephone"
                                    label="Numero de t&eacute;l&eacute;phone"
                                    type="text"
                                    fullWidth
                                    className={classes.textField}
                                    value={restoEdit.telephone}
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
                                message={messageSnackBar}
                            />
                        </Snackbar>
                    </div>
                </main>
            </div>
        )
    }
}
const condition = authUser => authUser && authUser.roles.includes(ROLES.ADMIN);
export default compose(withFirebase, withAuthorization(condition), withStyles(styles))(RestosAdminPage);