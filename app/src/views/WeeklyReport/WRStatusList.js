import React, {Component} from 'react';
import '../../Rhythmus.css';
import Config from '../../config.js';

class WRStatusList extends Component {

    constructor(){
        super();
        this.state = {
            teammates:false,
            isLoading:false
        };
    }
    
    componentDidMount() {
        this.setState({isLoading:true});

        fetch(Config.baseURL + '/wp-json/rhythmus/v1/wr-status-list?'+Config.authKey,{
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
                let teammates = data.teammates;
                this.setState({teammates:teammates,isLoading:false});
            }
        ).catch(error => this.setState({error, isLoading:false}));
    }

    render() {

        return(
        <div>Weekly Report</div>
        )
    }
}

export default WRStatusList;