import React from 'react';

import { withFirebase } from '../Firebase';

const SignOutButton = ({firebase}) => (
  <button type="button" onClick={firebase.logout}>
    Se d&eacute;connecter
  </button>
);

export default withFirebase(SignOutButton);