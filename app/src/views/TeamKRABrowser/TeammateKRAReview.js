import React, {Component} from 'react';
import '../../Rhythmus.css';
import Config from '../../config.js';

class TeammateKRAReview extends Component {

    constructor(){
        super();
        this.state = {
            teammate:{},
            isLoading:false,
            userid:"",
            month:"",
            year:""
        };
    }
    
    componentDidMount() {

        this.setState({isLoading:true});

        const{year, month, userid} = this.props;
        let params = "year="+year+"&userid="+userid;
        fetch(Config.baseURL + '/wp-json/rhythmus/v1/kra-review?'+params+'&'+Config.authKey,{
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
                let teammate = data.teammate;
                this.setState({teammate:teammate,isLoading:false});
            }
        ).catch(error => this.setState({error, isLoading:false}));
    
    }
    render() {
        const{isLoading, error, teammate} = this.state;
        if(error)
        {
            return <p>{error.message}</p>
        }
        if(isLoading)
        {
            return <p>Loading...</p>;
        }

        let desc = this.props.userid +"-"+this.props.month+"-"+this.props.year;//+"-"+this.state.teammate.userid;
        return(
            <div>Teammate:{desc}</div>
        )
    }
}
export default TeammateKRAReview;