import React, {Component} from 'react';
import {compose} from 'recompose';

import { withStyles, CssBaseline, IconButton, Paper, Table, TableHead, TableCell, TableRow, TableBody, TableFooter, TablePagination, Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions} from '@material-ui/core';
import { Add, Edit, Delete } from '@material-ui/icons';

import {withFirebase} from '../Firebase';
import AppbarAdmin from './appbar-admin';

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
    }
});

class CardsAdminPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            open: true,
            selectedIndexInList: 0,
            openDeleteDialog: false,
            page: 0,
            users: []
        };
    }

    handleOpenDeleteDialog = () => {
        this.setState({openDeleteDialog: true});
    }

    handleCloseDeleteDialog = () => {
        this.setState({openDeleteDialog: false});
    }

    handleChangePage = (event, page) => {
        this.setState({page});
    }

    componentDidMount() {
        this.setState({loading: true});
        this.props.firebase.users().on('value', snapshot => {
            const usersObject = snapshot.val();
            const usersList = Object.keys(usersObject).map(key => ({
                ...usersObject[key],
                uid: key
            }));
            this.setState({
                users: usersList,
                loading: false
            })
        });
    }

    componentWillUnmount() {
        this.props.firebase.users().off();
    }

    render() {
        // const {users, loading} = this.state;
        const {classes} = this.props;
        return (
            <div className={classes.root}>
                <CssBaseline />       
                <AppbarAdmin selectedIndexInList={1} />         
                <main className={classes.content}>
                    <div className={classes.appBarSpacer}/>

                    <div className={classes.tableContainer}>
                        <Button variant="contained" className={classes.buttonAdd}>
                            Ajouter
                            {/* This Button uses a Font Icon, see the installation instructions in the docs. */}
                            <Add className={classes.rightIcon} />
                        </Button>
                        <Paper className={classes.paperTable}>
                            <Table className={classes.table}>
                                <TableHead>
                                    <TableRow>
                                        <TableCell component="th">Nom</TableCell>
                                        <TableCell>Type de cuisine</TableCell>
                                        <TableCell>Adresse</TableCell>
                                        <TableCell>Photo</TableCell>
                                        <TableCell>Options</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <TableRow key={1}>
                                        <TableCell>Grill</TableCell>
                                        <TableCell>Cuisine chinoise</TableCell>
                                        <TableCell>St.Jean Road</TableCell>
                                        <TableCell>Photo</TableCell>
                                        <TableCell>
                                            <IconButton size="small" color="primary" aria-label="Modifier" className={classes.margin}>
                                                <Edit />
                                            </IconButton>
                                            
                                            <IconButton color='secondary' aria-label="Supprimer" className={classes.margin} onClick={this.handleOpenDeleteDialog}>
                                                <Delete />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                                <TableFooter>
                                    <TableRow>
                                        <TablePagination colSpan={3} count={12} rowsPerPage={10} page={1} SelectProps={{native: true}} onChangePage={this.handleChangePage} />
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
                    </div>
                </main>
            </div>
        )
    }
}

export default compose(withFirebase, withStyles(styles))(CardsAdminPage);