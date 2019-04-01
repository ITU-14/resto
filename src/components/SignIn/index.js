import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { compose } from 'recompose';

import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';
import { CssBaseline, Paper, withStyles, Avatar, TextField, Button, Typography, FormControl, Divider } from '@material-ui/core';
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
        // backgroundColor: '#d1ecf1'
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing.unit,
    },
    submit: {
        marginTop: theme.spacing.unit * 3,
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

const SignInPage = () => (
    <div>
        <SignInForm />
    </div>
);

const INITIAL_STATE = {
    email: '',
    password: '',
    error: null
}

class SignInFormBase extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ...INITIAL_STATE
        }
    }

    onSubmit = (event) => {
        const {email, password} = this.state;
        this.props.firebase
        .loginWithEmailAndPassword(email, password)
        .then( () => {
            this.setState({ ...INITIAL_STATE });
            this.props.history.push(ROUTES.LANDING);
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
            email,
            password,
            error
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
                        Veuillez-vous connecter
                    </Typography>
                    {error && 
                    <div className={classes.errorMessage}>
                        <p>{error.message}</p>
                    </div>
                    }
                    <form onSubmit={this.onSubmit} className={classes.form}>
                        <div className={classes.section1}>
                            <FormControl margin="normal" required fullWidth>
                                <TextField id="email" label="Adresse mail" type="email" name="email" variant="outlined" value={email} onChange={this.onChange} required />
                            </FormControl>

                            <FormControl margin="normal" required fullWidth>
                                <TextField id="password" label="Mot de passe" type="password" name="password" variant="outlined" value={password} onChange={this.onChange} required />
                            </FormControl>
                            
                            <Button variant="contained" type="submit" color="primary" className={classes.submit} fullWidth>Se connecter</Button>
                        </div>
                        <Divider variant="middle" />
                        <div>
                            <p>Vous n'avez pas encore de compte? <Link to={ROUTES.SIGN_UP} className={classes.link}>Inscrivez-vous</Link></p>
                        </div>
                    </form>
                </Paper>
            </main>
        );
    }
}

const SignInForm = compose(withRouter, withFirebase, withStyles(styles))(SignInFormBase);

export { SignInForm };

export default SignInPage;