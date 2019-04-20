import React, { Component } from 'react';

class DeleteDialog extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Dialog open={this.props.openDeleteDialog} onClose={this.handleCloseDeleteDialog} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                <DialogTitle id="alert-dialog-title">{this.props.deleteLabel}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        &Ecirc;tes-vous s&ucirc;re de vouloir supprimer le resto {this.props.resto_name}?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.handleCloseDeleteDialog} color="default">
                        Annuler
                    </Button>

                    <Button onClick={this.handleCloseDeleteDialog} color="secondary" autoFocus>
                        Supprimer
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}