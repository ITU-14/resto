import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import SignUpPage from '../SignUp';
import SignInPage from '../SignIn';

import * as ROUTES from '../../constants/routes';
import { withAuthentication } from '../Session';
import { RestosAdminPage, CardsAdminPage, MenusAdminPage } from '../Admin';
import HomePageResto from '../Home';
import DetailsResto from '../Details';

const App = () => (
    <Router>
        <div>
            <Route exact path={ROUTES.LANDING} component={HomePageResto} />
            <Route path={ROUTES.DETAILS} component={DetailsResto} />
            <Route path={ROUTES.SIGN_UP} component={SignUpPage} />
            <Route path={ROUTES.SIGN_IN} component={SignInPage} />
            <Route exact path={ROUTES.ADMIN} component={RestosAdminPage} />
            <Route path={ROUTES.ADMIN_RESTOS} component={RestosAdminPage} />
            <Route path={ROUTES.ADMIN_CARTES} component={CardsAdminPage} />
            <Route path={ROUTES.ADMIN_MENUS} component={MenusAdminPage} />
        </div>
    </Router>
);

export default withAuthentication(App);