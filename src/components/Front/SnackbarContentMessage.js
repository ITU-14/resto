import React from 'react';
import classNames from 'classnames';
import { SnackbarContent, withStyles, IconButton } from '@material-ui/core';
import { compose } from 'recompose';
import { CloseOutlined, CheckCircle } from '@material-ui/icons';

const styles = theme => ({
    success: {
      backgroundColor: '#43a047',
    },
    icon: {
      fontSize: 20,
    },
    iconVariant: {
      opacity: 0.9,
      marginRight: theme.spacing.unit,
    },
    message: {
      display: 'flex',
      alignItems: 'center',
    },
});


function SnackbarContentMessage(props) {
    const { classes, className, message, onClose } = props;
  
    return (
        <SnackbarContent className={classNames(classes.success, className)}
                        aria-describedby="client-snackbar"
                        message={
                            <span id="client-snackbar" className={classes.message}>
                                <CheckCircle className={classNames(classes.icon, classes.iconVariant)} />
                                {message}
                            </span>
                        }
                        action={[
                        <IconButton
                            key="close"
                            aria-label="Close"
                            color="inherit"
                            className={classes.close}
                            onClick={onClose}
                        >
                            <CloseOutlined className={classes.icon} />
                        </IconButton>,
                        ]}
        />
    );
}

export default compose(withStyles(styles))(SnackbarContentMessage);