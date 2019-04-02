import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

import * as ROLES from '../../constants/roles';

const config = {
    apiKey: "AIzaSyDE8lfFd8JZx4Wpdas0uUMYCsL0Pwo3sKY",
    authDomain: "resto-39060.firebaseapp.com",
    databaseURL: "https://resto-39060.firebaseio.com",
    projectId: "resto-39060",
    storageBucket: "resto-39060.appspot.com",
    messagingSenderId: "1085917873603"
};

class Firebase {
    constructor() {
        app.initializeApp(config);
        this.auth = app.auth();
        this.db = app.database();
    }

    registerWithEmailAndPassword = (email, password) => this.auth.createUserWithEmailAndPassword(email, password);
    

    loginWithEmailAndPassword = (email, password) => this.auth.signInWithEmailAndPassword(email, password);
    

    logout = () => this.auth.signOut();
    

    doPasswordReset = (email) => this.auth.sendPasswordResetEmail(email);
    

    resetPassword = () => this.auth.currentUser.updatePassword();

    onAuthUserListener = (next, fallback) => this.auth.onAuthStateChanged(authUser => {
        if(!authUser) {
            fallback();
            return;
        }
        this.user(authUser.uid).once('value').then(snapshot => {
            const dbUser = snapshot.val();
            if(!dbUser) {
                fallback();
            }
            if(!dbUser.roles) {
                dbUser.roles = [ROLES.USER];
            }
            authUser = {
                email: authUser.email,
                username: authUser.username,
                ...dbUser
            };
            next(authUser);
        });
    });

    /* USERS API */
    user = uid => this.db.ref(`user/${uid}`);
    
    users = () => this.db.ref('user');

    /* RESTO API */
    /* get list of resto */
    restos = () => this.db.ref('resto');

    /* get resto by id */
    resto = restoid => this.db.ref(`resto/${restoid}`);

    /* MENU API */
    /* get list of menus */
    menus = () => this.db.ref('menu');

    /* get menu by id */
    menu = menuid => this.db.ref(`menu/${menuid}`);

    /* CARTES API */
    /* get list of cartes */
    cartes = () => this.db.ref('carte');

    /* get carte by id */
    carte = carteid => this.db.ref(`carte/${carteid}`);

    /* PLATS API */
    /* get list of plates */
    plats = () => this.db.ref('plat');

    /* get plat by id */
    plat = platid => this.db.ref(`plat/${platid}`);

    /* TYPE PLAT API */
    /* get list of type plat */
    typePlats = () => this.db.ref('typePlat');

}

export default Firebase;