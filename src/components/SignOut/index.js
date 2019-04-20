import React from 'react';

import { withFirebase } from '../Firebase';
import { IconButton } from '@material-ui/core';
import { PowerSettingsNew } from '@material-ui/icons';

const SignOutButton = ({ firebase }) => (
  <IconButton color="inherit" onClick={firebase.logout} title="Se d&eacute;connecter">
    <PowerSettingsNew />
  </IconButton>
);

export default withFirebase(SignOutButton);