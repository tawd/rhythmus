import React, {Component} from 'react';
import '../Rhythmus.css';
import Config from '../config.js';

class TeamList extends Component {

    constructor(){
        super();
        this.state = {
            teammates:[],
            isLoading:false
        };
    }

    componentDidMount() {
        this.setState({isLoading:true});

        fetch(Config.baseURL + '/wp-json/rhythmus/v1/teammate-list'+Config.authKey,{
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
                let teammates = data.teammates.map((teammate) => {
                    let scores = teammate.scores;
                    let scoreCols = "";
                    
                    for (let i = 1; i <= 12; i++) {
                        scoreCols =[scoreCols,<td key={teammate.userid+"-"+i}>{scores[i]}</td>];
                      }
                    return (
                        <tr key={teammate.userid}><td onClick={this.props.onChooseTeammate}>{teammate.name}</td>{scoreCols}</tr>
                    );
                })
            this.setState({teammates:teammates,isLoading:false});
            }
        ).catch(error => this.setState({error, isLoading:false}));
    }

    getMonths(){
        var m = [ "January", "February", "March", "April", "May", "June", 
           "July", "August", "September", "October", "November", "December" ];
        let months;
        for (let i = 0; i < 12; i++) {
            months =[months,<td key={"Month-"+i}>{m[i]}</td>];
          }
        return months;
    }

    render() {
        const{isLoading, error, teammates} = this.state;
        if(error)
        {
            return <p>{error.message}</p>
        }
        if(isLoading)
        {
            return <p>Loading...</p>;
        }

        return(
            <table className="year-chart">
          <tbody>
          <tr><td>Name</td>{this.getMonths()}</tr>
          {teammates}
          </tbody>
        </table>
        )
    }
}
export default TeamList;