import React, {Component} from 'react';
import {compose} from 'recompose';

import { withStyles, CssBaseline, IconButton, Paper, Table, TableHead, TableCell, TableRow, TableBody, TableFooter, TablePagination, Button, Avatar, CircularProgress} from '@material-ui/core';
import { Add, Edit } from '@material-ui/icons';

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
            openEditDialog: false,
            page: 0,
            menus: [],
            rowsPerPage: 10,
            ...INITIALSTATE
        };
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

    componentDidMount() {
        this.setState({loading: true});
        this.props.firebase.menus().on('value', snapshot => {
            const platObjects = snapshot.val();
            const platsList = Object.keys(platObjects).map(key => ({
                ...platObjects[key],
                id: key
            }));
            this.setState({
                menus: platsList,
                loading: false
            });
        });
    }

    componentWillUnmount() {
        this.props.firebase.menus().off();
    }

    onChange = (event) => {
        this.setState({ [event.target.name]: event.target.value });
    }

    render() {
        const {menus, page, rowsPerPage, loading} = this.state;
        const {classes} = this.props;
        const loader = <div className={classes.progressContainer}>
            <CircularProgress className={classes.progress} />
        </div>
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
                            {loading && loader}
                            {!loading && <Table className={classes.table}>
                                <TableHead>
                                    <TableRow>
                                        <TableCell component="th">Photo</TableCell>
                                        <TableCell component="th">Nom</TableCell>
                                        <TableCell component="th">Prix (en Rs.)</TableCell>
                                        <TableCell component="th">Options</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {menus.slice(page*rowsPerPage, (page*rowsPerPage) + rowsPerPage).map(plat => (
                                        <TableRow key={plat.id}>
                                            <TableCell>
                                                <Avatar alt={plat.nom_plat} src={plat.photo} className={classes.bigAvatar} />
                                            </TableCell>
                                            <TableCell>{plat.nom}</TableCell>
                                            <TableCell >{plat.prix}</TableCell>
                                            <TableCell>
                                                <IconButton size="small" color="primary" aria-label="Modifier" title="Modifier" className={classes.margin}>
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
                                            count={menus.length} 
                                            rowsPerPage={rowsPerPage} 
                                            page={page} 
                                            SelectProps={{native: true}} 
                                            onChangePage={this.handleChangePage} 
                                            labelDisplayedRows={({from, to, count}) => `${from} - ${to} sur ${count} menus`} 
                                            labelRowsPerPage="Lignes par page" />
                                    </TableRow>
                                </TableFooter>
                            </Table>}
                        </Paper>

                    </div>
                </main>
            </div>
        )
    }
}

// const condition = authUser => authUser && authUser.roles.includes(ROLES.ADMIN);

export default compose(withFirebase, withStyles(styles))(MenusAdminPage);