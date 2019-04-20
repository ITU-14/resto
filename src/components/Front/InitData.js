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

    randomIdx(size, min, max) {
        let indexes = [];
        while(indexes.length < size) {
            let idx = this.getRandomIdx(min, max);
            if(!indexes.includes(idx)) indexes.push(idx);
        }
        return indexes;
    }

    getRandomIdx(min, max) {
        return Math.floor(Math.random() * (max - min) ) + min;
    }


    createCarte(plats, restos) {
        // this.setState({ loading: true });
        let carte = {resto_id: null, plats: []};
        const k = 10;
        restos.forEach(resto => {
            carte.resto_id = resto._id;
            carte.plats = [];
            let randomIdxResistance = this.randomIdx(k, 0, 171);
            let randomIdxEntree = this.randomIdx(k, 172, 335);
            let randomIdxDessert = this.randomIdx(k, 336, 383);
            // random resistance 0 - 171 172
            for(let i=0;i<k;i++) {
                // random resistance
                carte.plats.push(plats[randomIdxResistance[i]]);
                // random hors d'oeuvre
                carte.plats.push(plats[randomIdxEntree[i]]);
                // random dessert
                carte.plats.push(plats[randomIdxDessert[i]]);
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