import React, {Component} from 'react';
import {compose} from 'recompose';

import { withStyles, CssBaseline, IconButton, Paper, Table, TableHead, TableCell, TableRow, TableBody, TableFooter, TablePagination, Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, TextField, Select, MenuItem, Avatar} from '@material-ui/core';
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
    },
    selectEmpty: {
        marginTop: theme.spacing.unit * 2,
    },
    bigAvatar: {
        margin: 10,
        width: 60,
        height: 60
    }
});

const INITIALSTATE = {
    nom: '',
    type: '',
    description: '',
    photo: '',
    prix: 0
};

class MenusAdminPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            open: true,
            selectedIndexInList: 0,
            openDeleteDialog: false,
            openEditDialog: false,
            page: 0,
            plats: [],
            typePlats: [],
            rowsPerPage: 5,
            ...INITIALSTATE
        };
    }

    handleOpenDeleteDialog = () => {
        this.setState({openDeleteDialog: true});
    }

    handleCloseDeleteDialog = () => {
        this.setState({openDeleteDialog: false});
    }

    handleOpenEditDialog = () => {
        this.setState({openEditDialog: true});
    }

    handleCloseEditDialog = () => {
        this.setState({openEditDialog: false});
    }

    handleChangePage = (event, page) => {
        this.setState({page});
    }

    handleChangeRowsPerPage = (event) => {
        this.setState({rowsPerPage: event.target.value});
    }

    componentDidMount() {
        this.setState({loading: true});
        this.props.firebase.plats().on('value', snapshot => {
            const platObjects = snapshot.val();
            const platsList = Object.keys(platObjects).map(key => ({
                ...platObjects[key],
                id: key
            }));
            this.setState({
                plats: platsList,
                loading: false
            });
        });
        this.props.firebase.typePlats().on('value', snapshot => {
            const categories = snapshot.val();
            const categoryList = Object.keys(categories).map(key => ({
                ...categories[key],
                id: key
            }));
            this.setState({
                typePlats: categoryList
            })
        });
    }

    componentWillUnmount() {
        this.props.firebase.plats().off();
        this.props.firebase.typePlats().off();
    }

    onChange = (event) => {
        this.setState({ [event.target.name]: event.target.value });
    }

    render() {
        const {plats, page, rowsPerPage, typePlats, nom, type, description, prix} = this.state;
        const {classes} = this.props;
        return (
            <div className={classes.root}>
                <CssBaseline />       
                <AppbarAdmin selectedIndexInList={2} />         
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
                                        <TableCell component="th">Photo</TableCell>
                                        <TableCell component="th">Nom</TableCell>
                                        <TableCell component="th">Type</TableCell>
                                        <TableCell component="th">Prix (en Rs.)</TableCell>
                                        <TableCell component="th">Options</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {plats.slice(page*rowsPerPage, (page*rowsPerPage) + rowsPerPage).map(plat => (
                                        <TableRow key={1}>
                                            <TableCell>
                                                <Avatar alt={plat.nom_plat} src={plat.photo} className={classes.bigAvatar} />
                                            </TableCell>
                                            <TableCell>{plat.nom_plat}</TableCell>
                                            <TableCell>{plat.type_plat}</TableCell>
                                            <TableCell align="right">{plat.prix}</TableCell>
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
                                            count={plats.length} 
                                            rowsPerPage={rowsPerPage} 
                                            page={page} 
                                            SelectProps={{native: true}} 
                                            onChangePage={this.handleChangePage} 
                                            onChangeRowsPerPage={this.handleChangeRowsPerPage}
                                            labelDisplayedRows={({from, to, count}) => `${from} - ${to} sur ${count} plats`} 
                                            labelRowsPerPage="Lignes par page" />
                                    </TableRow>
                                </TableFooter>
                            </Table>
                        </Paper>

                        <Dialog open={this.state.openDeleteDialog} onClose={this.handleCloseDeleteDialog} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                            <DialogTitle id="alert-dialog-title">{"Supprimer le resto resto 1"}</DialogTitle>
                            <DialogContent>
                                <DialogContentText id="alert-dialog-description">
                                
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

                        <Dialog open={this.state.openEditDialog} 
                                onClose={this.handleCloseEditDialog} 
                                aria-labelledby="form-dialog-title" 
                                aria-describedby="form-dialog-description">
                            <DialogTitle id="form-dialog-title">Ajouter un plat</DialogTitle>
                            <DialogContent>
                                <TextField id="nom" label="Nom" type="text" name="nom" variant="outlined" value={nom} onChange={this.onChange} fullWidth />
                                <Select value={type} 
                                        onChange={this.onChange}
                                        variant="outlined"
                                        fullWidth>
                                    {typePlats.map(typePlat => (
                                        <MenuItem key={type.id} value={type.id}>{typePlat.nom}</MenuItem>
                                    ))}
                                </Select>
                                <TextField id="nom" label="Nom" type="text" name="nom" variant="outlined" value={nom} onChange={this.onChange} fullWidth />
                                <TextField id="description" label="Description" type="text" name="description" variant="outlined" value={description} onChange={this.onChange} fullWidth />
                                <TextField id="prix" label="prix" type="text" name="description" variant="outlined" value={prix} onChange={this.onChange} fullWidth />
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

// const condition = authUser => authUser && authUser.roles.includes(ROLES.ADMIN);

export default compose(withFirebase, withStyles(styles))(MenusAdminPage);