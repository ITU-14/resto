import React, { Component } from 'react';
import { compose } from 'recompose';
import { withFirebase } from '../Firebase';

class InitData extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loadingResto: true,
            loadingPlat: true,
            plats: [],
            restos: []
        }
    }

    componentDidMount() {
        
        this.loadRestos();
        this.loadPlats();
    }

    componentWillUnmount() {
        this.props.firebase.restos().off();
        this.props.firebase.plats().off();
        this.props.firebase.cartes().off();
    }

    loadRestos() {
        this.setState({ loadingResto: true });
        this.props.firebase.restos().on('value', snapshot => {
            const restosObject = snapshot.val();
            const restosList = Object.keys(restosObject).map(key => ({
                ...restosObject[key],
                id: key
            }));

            this.setState({
                restos: restosList,
                loadingResto: false
            });
        });
    }

    loadPlats() {
        this.setState({ loadingPlat: true });
        this.props.firebase.plats().on('value', snapshot => {
            const platsObject = snapshot.val();
            /*const platsList = Object.keys(platsObject).map(key => ({
                ...platsObject[key],
                id: key
            }));*/

            this.setState({
                plats: platsObject,
                loadingPlat: false
            });
        });
    }

    getRandomIdx(min, max) {
        return Math.floor(Math.random() * (max - min) ) + min;
    }


    createCarte(plats, restos) {
        // this.setState({ loading: true });
        let carte = {resto_id: null, plats: []};
        
        restos.forEach(resto => {
            carte.resto_id = resto._id;
            carte.plats = [];
            // random resistance 0 - 171 172
            for(let i=0;i<10;i++) {
                // random resistance
                let randomIdx = this.getRandomIdx(0, 171);
                carte.plats.push(plats[randomIdx]);
                //console.log("RDX 01::::", randomIdx);
                // random hors d'oeuvre
                randomIdx = this.getRandomIdx(172, 335);
                carte.plats.push(plats[randomIdx]);
                // console.log("RDX 02::::", randomIdx);

                // random dessert
                randomIdx = this.getRandomIdx(336, 383);
                carte.plats.push(plats[randomIdx]);
                // console.log("RDX 03::::", randomIdx);

            }
            // save to firebase
            this.props.firebase.cartes().push(carte);
            // console.log(carte);
        });
        // this.setState({ loading: false });
    }


    render() {
        const {restos, plats, loadingResto, loadingPlat} = this.state;
        if(!loadingResto && !loadingPlat)
            this.createCarte(plats, restos);

        return (
            <div>
                {(loadingResto && loadingPlat) && <p>Save to database.....</p>}

            </div>
        )
    }
}

export default compose(withFirebase)(InitData);