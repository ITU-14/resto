import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { compose } from 'recompose';

import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';
import * as ROLES from '../../constants/roles';
import { CssBaseline, Paper, withStyles, Avatar, TextField, Button, Typography, FormControl, Divider} from '@material-ui/core';
import { LockOutlined } from '@material-ui/icons';

const styles = theme => ({
    main: {
        width: 'auto',
        display: 'block', // Fix IE 11 issue.
        marginLeft: theme.spacing.unit * 3,
        marginRight: theme.spacing.unit * 3,
        [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
        width: 400,
        marginLeft: 'auto',
        marginRight: 'auto',
        },
    },
    paper: {
        marginTop: theme.spacing.unit * 8,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`,
    },
    avatar: {
        margin: theme.spacing.unit,
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing.unit,
    },
    submit: {
        marginTop: theme.spacing.unit * 3,
        backgroundColor: '#28A745',
        '&:hover': {
            backgroundColor: '#289745',
        },
        color: '#FFF'
    },
    section1: {
        marginBottom: `${theme.spacing.unit * 2}px`,
    },
    link: { 
        textDecoration: 'none',
        color: '#2196F3'
    },
    errorMessage: {
        backgroundColor: '#F8D7DA',
        width: '100%',
        borderColor: 'f5c6cb',
        padding: `0 ${theme.spacing.unit * 2}px`,
        color: '#721C24',
        marginTop: `${theme.spacing.unit}px`
    }
});

const SignUpPage = () => (
    <SignUpForm />
);

const INITIAL_STATE = {
    username: '',
    email: '',
    passwordRegister: '',
    confirmPasswordRegister: '',
    errorRegister: null,
    isAdmin: false
}

class SignUpFormBase extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ...INITIAL_STATE
        }
    }

    onSubmit = (event) => {
        const {username, email, passwordRegister, isAdmin} = this.state;
        const roles = [];
        if(isAdmin) roles.push(ROLES.ADMIN);
        else roles.push(ROLES.USER);
        this.props.firebase
        .registerWithEmailAndPassword(email, passwordRegister)
        .then( authUser => {
            return this.props.firebase.user(authUser.user.uid).set({username, email, roles});
        }).then(() => {
            this.setState({ ...INITIAL_STATE });
            this.props.history.push(ROUTES.HOME);
        }).catch( error => {
            this.setState({ error });
        });
        event.preventDefault();
    }

    onChange = (event) => {
        this.setState({ [event.target.name]: event.target.value });
    }

    render() {
        const {
            username,
            email,
            passwordRegister,
            confirmPasswordRegister,
            errorRegister
        } = this.state;
        const { classes } = this.props;
        return (
            <main className={classes.main}>
                <CssBaseline />
                <Paper className={classes.paper}>
                    <Avatar className={classes.avatar}>
                        <LockOutlined />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Veuillez-vous inscrire
                    </Typography>
                    {errorRegister && 
                    <div className={classes.errorMessage}>
                        <p>{errorRegister.message}</p>
                    </div>
                    }
                    <form onSubmit={this.onSubmit} className={classes.form}>
                        <div className={classes.section1}> 
                            <FormControl margin="normal" required fullWidth>
                                <TextField id="username" label="Votre nom d'utilisateur" type="text" name="username" variant="outlined" value={username} onChange={this.onChange} required />
                            </FormControl>

                            <FormControl margin="normal" required fullWidth>
                                <TextField id="email" label="Votre adresse mail" type="text" name="email" variant="outlined" value={email} onChange={this.onChange} required/>
                            </FormControl>

                            <FormControl margin="normal" required fullWidth>
                                <TextField id="password" label="Votre mot de passe" type="password" name="passwordRegister" variant="outlined" value={passwordRegister} onChange={this.onChange} required/>
                            </FormControl>

                            <FormControl margin="normal" required fullWidth>
                                <TextField id="confirmPassword" label="Confirmer le mot de passe" type="password" name="confirmPasswordRegister" variant="outlined" value={confirmPasswordRegister} onChange={this.onChange} required />
                            </FormControl>

                            <Button type="submit" variant="contained" size="large" className={classes.submit} fullWidth>S'inscrire</Button>
                        </div>
                        <Divider  />
                        <p> Vous avez d&eacute;j&agrave; un compte? <Link to={ROUTES.SIGN_IN} className={classes.link}>Se connecter</Link> </p>
                    </form>
                </Paper>
            </main>
        );
    }
}

const SignUpForm = compose(withRouter,withFirebase, withStyles(styles))(SignUpFormBase);

export default SignUpPage;

export { SignUpForm };