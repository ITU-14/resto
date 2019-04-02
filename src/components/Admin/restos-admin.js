import React, {Component, createRef} from 'react';
import {compose} from 'recompose';

import { withStyles, CssBaseline, IconButton, Paper, Table, TableHead, TableCell, TableRow, TableBody, TableFooter, TablePagination, Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, TextField} from '@material-ui/core';
import { Add, Edit, Delete } from '@material-ui/icons';

import {withFirebase} from '../Firebase';
import {withAuthorization} from '../Session';
import Dropzone from 'react-dropzone'
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
        // flexShrink: 0,
        //color: theme.palette.text.secondary,
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
});

const dropzoneRef = createRef()

class RestosAdminPage extends Component {
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
        };
    }

    componentDidMount() {
        this.setState({loading: true});
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
        this.setState({openDeleteDialog: true});
    }

    handleOpenEditDialog = () => {
        this.setState({openEditDialog: true});
    }

    handleCloseEditDialog = () => {
        this.setState({openEditDialog: false});
    }

    handleCloseDeleteDialog = () => {
        this.setState({openDeleteDialog: false});
    }

    handleChangePage = (event, page) => {
        this.setState({page});
    }

    handleChangeRowsPerPage = (event) => {
        this.setState({page: 0, rowsPerPage: event.target.value});
    }

    onDropImage = () => {
        
    }

    render() {
        // const {users, loading} = this.state;
        const {classes} = this.props;
        const {restos, page, rowsPerPage} = this.state;
        return (
            <div className={classes.root}>
                <CssBaseline />       
                <AppbarAdmin selectedIndexInList={0} />         
                <main className={classes.content}>
                    <div className={classes.appBarSpacer}/>

                    <div className={classes.tableContainer}>
                        <Button variant="contained" className={classes.buttonAdd} onClick={this.handleOpenEditDialog}>
                            Ajouter
                            <Add className={classes.rightIcon} />
                        </Button>
                        <Paper className={classes.paperTable}>
                            <Table className={classes.table}>
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
                                    {restos.slice(page*rowsPerPage, (page*rowsPerPage) + rowsPerPage).map(resto => (
                                        <TableRow className={classes.row} key={resto.id}>
                                            <TableCell>{resto.nom}</TableCell>
                                            <TableCell>{resto.typedecuisine}</TableCell>
                                            <TableCell>{resto.adress}</TableCell>
                                            <TableCell>{resto.telephone}</TableCell>
                                            <TableCell>Image</TableCell>
                                            <TableCell>
                                                <IconButton size="small" color="primary" aria-label="Modifier" className={classes.margin}>
                                                    <Edit />
                                                </IconButton>
                                                
                                                <IconButton color='secondary' aria-label="Supprimer" className={classes.margin} onClick={this.handleOpenDeleteDialog}>
                                                    <Delete />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))} 
                                    
                                </TableBody>
                                <TableFooter>
                                    <TableRow>
                                        <TablePagination 
                                            rowsPerPageOptions={[5, 10, 25]}
                                            colSpan={3} 
                                            count={restos.length} 
                                            rowsPerPage={rowsPerPage} 
                                            page={page} 
                                            SelectProps={{native: true}} 
                                            onChangePage={this.handleChangePage} 
                                            onChangeRowsPerPage={this.handleChangeRowsPerPage}
                                            labelDisplayedRows={({from, to, count}) => `${from} - ${to} sur ${count} restos`} 
                                            labelRowsPerPage="Lignes par page" />
                                    </TableRow>
                                </TableFooter>
                            </Table>
                        </Paper>

                        <Dialog open={this.state.openDeleteDialog} onClose={this.handleCloseDeleteDialog} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                            <DialogTitle id="alert-dialog-title">{"Supprimer le resto resto 1"}</DialogTitle>
                            <DialogContent>
                                <DialogContentText id="alert-dialog-description">
                                Let Google help apps determine location. This means sending anonymous location data to
                                Google, even when no apps are running.
                                </DialogContentText>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={this.handleClose} color="default">
                                Annuler
                                </Button>

                                <Button onClick={this.handleClose} color="secondary" autoFocus>
                                Supprimer
                                </Button>
                            </DialogActions>
                        </Dialog>

                        <Dialog open={this.state.openEditDialog} onClose={this.handleCloseEditDialog} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                            <DialogTitle id="alert-dialog-title">{"Creer un resto"}</DialogTitle>
                            <DialogContent>
                                <TextField
                                    margin="normal"
                                    id="nom-resto"
                                    label="Nom du resto"
                                    type="text"
                                    fullWidth
                                    className={classes.textField}
                                />
                                <TextField
                                    id="description-resto"
                                    label="Description"
                                    type="text"
                                    multiline
                                    rows="4"
                                    margin="normal"
                                    fullWidth
                                    className={classes.textField}
                                />
                                <TextField
                                    margin="normal"
                                    id="type-cuisine"
                                    label="Type de cuisine"
                                    type="text"
                                    fullWidth
                                    className={classes.textField}
                                />
                                <TextField
                                    margin="normal"
                                    id="address"
                                    label="Adresse"
                                    type="text"
                                    fullWidth
                                    className={classes.textField}
                                />
                                <TextField
                                    margin="normal"
                                    id="phone"
                                    label="Numero de t&eacute;l&eacute;phone"
                                    type="text"
                                    fullWidth
                                    className={classes.textField}
                                />
                                <TextField
                                    margin="normal"
                                    id="photo"
                                    label="Photo"
                                    type="text"
                                    fullWidth
                                    className={classes.textField}
                                />
                                <Dropzone ref={dropzoneRef}>
                                {({getRootProps, getInputProps}) => (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      <p>Drag 'n' drop some files here, or click to select files</p>
    </div>
  )}
                                </Dropzone>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={this.handleCloseEditDialog} color="default">
                                Annuler
                                </Button>

                                <Button onClick={this.handleCloseEditDialog} color="primary" autoFocus>
                                Cr&eacute;er
                                </Button>
                            </DialogActions>
                        </Dialog>
                    </div>
                </main>
            </div>
        )
    }
}
/*
const restosList = ({users}) => (
    <ul>
        <li>ok</li>
    </ul>
);*/
/* eslint-disable */
const condition = authUser => authUser && authUser.roles.includes(ROLES.ADMIN);

/* eslint-enable */
export default compose(withFirebase, withAuthorization(condition), withStyles(styles))(RestosAdminPage);