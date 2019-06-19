import React, {Component} from 'react';
// import TeammateKRAReview from './TeammateKRAReview';
import TeamListRow from '../TeamKRABrowser/TeamListRow';
import '../../Rhythmus.css';
import Config from '../../config.js';

// import { RIEToggle, RIEInput, RIETextArea, RIENumber, RIETags, RIESelect } from 'riek';
import _ from 'lodash';


class KRAEditor extends Component {

    constructor(){
        super();
        this.state = {
            isLoading:false,
            teammates:false
        };
    }
    
    onCloseKRA = () => {
        
    }

    componentDidMount() {
        this.setState({isLoading:true});

        const{userid} = this.props;
        this.setState({isLoading:true, userid:userid});
        let params = "teammate_id="+userid;

        let year = 2019;
        fetch(Config.baseURL + '/wp-json/rhythmus/v1/kra?'+params+'&'+Config.authKey,{
            method: "GET",
            cache: "no-cache"
        })
            .then(response => {
                if (response.ok) {
                  return response.json();
                } else {
                  throw new Error('Something went wrong ...');
                }
            })
            .then(data => {
                let kra = data;
                this.setState({kra:kra,isLoading:false});
            }
        ).catch(error => this.setState({error, isLoading:false}));
    }

    render() {
        // const{isLoading, error, userid} = this.state;
        // if(error)
        // {
        //     return <p>{error.message}</p>
        // }
        // if(isLoading)
        // {
        //     return <p>Loading...</p>;
        // }
        // if(this.viewTeammate){
        //     return(
        //         <div>
        //             <button onClick={this.onCloseKRA}>Close</button>
        //         </div>
        //     )
        // }

        return(
            <div>
                <p>test</p>
            </div>
        )
    }
}


export default KRAEditor;