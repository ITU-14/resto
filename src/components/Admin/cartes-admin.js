import React, {Component} from 'react';
import {compose} from 'recompose';

import { withStyles, CssBaseline, IconButton, Paper, Table, TableHead, TableCell, TableRow, TableBody, TableFooter, TablePagination, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Avatar, CircularProgress, Typography, Snackbar, NativeSelect} from '@material-ui/core';
import { Add, Edit } from '@material-ui/icons';

import {withFirebase} from '../Firebase';
import AppbarAdmin from './appbar-admin';
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
    selectEmpty: {
        marginTop: theme.spacing.unit * 2,
    },
    textField: {
        margin: theme.spacing.unit
    },
    textArea: {
        margin: theme.spacing.unit,
        height: "6em"
    },
    bigAvatar: {
        margin: 10,
        width: 60,
        height: 60
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

const INITIALSTATE = {
    editLabel: '',
    editButton: '',
    deleteLabel: ''
};

class CardsAdminPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            loadingTypePlat: false,
            showModal: false,
            openEditDialog: false,
            page: 0,
            plats: [],
            typePlats: [],
            platToEdit: this.initPlat(),
            rowsPerPage: 30,
            ...INITIALSTATE
        };
    }

    handleOpenEditDialog = (plat) => {
        this.setState({
            openEditDialog: true,
            platToEdit: plat,
            editLabel: `Modifier plat: ${plat.nom}`,
            editButton: 'Modifier'
        });
    }

    handleCloseEditDialog = () => {
        this.setState({openEditDialog: false});
    }

    handleChangePage = (event, page) => {
        this.setState({page});
    }

    initPlat() {
        return {
            _id: '', 
            nom: '',
            type_plat: '',
            description_plat: '',
            prix: 0,
            photo_plat: '/assets/img/default-resto.png'
        }
    }

    componentDidMount() {
        this.setState({loading: true, loadingTypePlat: true});
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
                typePlats: categoryList,
                loadingTypePlat: false
            })
        });
    }

    handleOpenCreateDialog = () => {
        const platNew = this.initPlat();
        this.setState({
            openEditDialog: true,
            platToEdit: platNew,
            editLabel: 'Ajouter un plat',
            editButton: 'Valider'
        });
    }

    saveOrEdit = () => {
        const platToEdit = this.state.platToEdit;
        const typePlats = this.state.typePlats;
        if(platToEdit.type_plat.localeCompare("") === 0) {
            platToEdit.type_plat = (typePlats.length > 0) ? typePlats[0].nom : "";
        }
        if(platToEdit._id.localeCompare("") === 0) {
            platToEdit._id = '_'.concat(Math.random().toString(36).substr(2, 9));
            this.props.firebase.plats().push(platToEdit);
            this.setState({openEditDialog: false, showModal: true, messageSnackBar: "Plat créé avec succès! Elle se trouve à la dernière page"});
        } else {
            this.props.firebase.plat(platToEdit.id).update(platToEdit);
            this.setState({openEditDialog: false, showModal: true, messageSnackBar: "Votre modification a été enregistré!"});
        }
        console.log(platToEdit)
    }

    componentWillUnmount() {
        this.props.firebase.plats().off();
        this.props.firebase.typePlats().off();
    }

    onChange = (event) => {
        let platToEdit = this.state.platToEdit;
        platToEdit[event.target.name] = event.target.value;
        this.setState({ platToEdit: platToEdit });
    }

    render() {
        const {plats, page, rowsPerPage, typePlats, editLabel, editButton, loading, platToEdit, messageSnackBar, showModal, loadingTypePlat} = this.state;
        const {classes} = this.props;
        const loader = <div className={classes.progressContainer}>
            <CircularProgress className={classes.progress} />
        </div>
        return (
            <div className={classes.root}>
                <CssBaseline />       
                <AppbarAdmin selectedIndexInList={1} />         
                <main className={classes.content}>
                    <div className={classes.appBarSpacer}/>

                    <div className={classes.tableContainer}>
                        <Typography variant="h5">
                            Liste des plats (pagin&eacute;e)
                        </Typography>
                        <Button variant="contained" className={classes.buttonAdd}  onClick={this.handleOpenCreateDialog}>
                            Ajouter
                            <Add className={classes.rightIcon} />
                        </Button>
                        <Paper className={classes.paperTable}>
                            {loading && loader}
                            {!loading && <Table className={classes.table}>
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
                                        <TableRow key={plat.id}>
                                            <TableCell>
                                                <Avatar alt={plat.nom} src={plat.photo_plat} className={classes.bigAvatar} />
                                            </TableCell>
                                            <TableCell>{plat.nom}</TableCell>
                                            <TableCell>{plat.type_plat}</TableCell>
                                            <TableCell>{plat.prix}</TableCell>
                                            <TableCell>
                                                <IconButton size="small" color="primary" aria-label="Modifier" className={classes.margin} onClick={() => this.handleOpenEditDialog(plat)}>
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
                                            count={plats.length} 
                                            rowsPerPage={rowsPerPage} 
                                            page={page} 
                                            SelectProps={{native: true}} 
                                            onChangePage={this.handleChangePage} 
                                            labelDisplayedRows={({from, to, count}) => `${from} - ${to} sur ${count} plats`} 
                                            labelRowsPerPage="Lignes par page" />
                                    </TableRow>
                                </TableFooter>
                            </Table> 
                        }
                        </Paper>

                        <Dialog open={this.state.openEditDialog} onClose={this.handleCloseEditDialog} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                            <DialogTitle id="alert-dialog-title">{editLabel}</DialogTitle>
                            <DialogContent>
                                <input type="hidden" name="_id" value={platToEdit._id} />
                                <TextField
                                    margin="normal"
                                    label="Nom du Plat"
                                    type="text"
                                    name="nom"
                                    fullWidth
                                    className={classes.textField}
                                    value={platToEdit.nom}
                                    onChange={this.onChange}
                                />

                                <TextField
                                    id="outlined-multiline-static"
                                    label="Description"
                                    margin="normal"
                                    variant="outlined"
                                    multiline
                                    rows="4"
                                    name="description_plat"
                                    defaultValue={platToEdit.description_plat}
                                    className={classes.textField}
                                    onChange={this.onChange}
                                    fullWidth
                                />

                                <TextField
                                    margin="normal"
                                    label="Prix"
                                    type="text"
                                    fullWidth
                                    name="prix"
                                    className={classes.textField}
                                    value={platToEdit.prix}
                                    onChange={this.onChange}
                                />
                                
                                <NativeSelect
                                    value={platToEdit.type_plat}
                                    onChange={this.onChange}
                                    name="type_plat"
                                    className={classes.selectEmpty}
                                    fullWidth
                                    id="category"
                                    disabled={loadingTypePlat}
                                >
                                    {typePlats.map(category => (
                                        <option value={category.nom} key={category.id}>{category.nom}</option>    
                                    ))}
                                </NativeSelect>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={this.handleCloseEditDialog} color="default">
                                    Annuler
                                </Button>

                                <Button onClick={this.saveOrEdit} color="primary" autoFocus>
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

// const condition = authUser => authUser && authUser.roles.includes(ROLES.ADMIN);

export default compose(withFirebase, withStyles(styles))(CardsAdminPage);