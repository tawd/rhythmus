import React, {Component} from 'react';
import TeammateKRAReview from './TeammateKRAReview';
import TeamListRow from './TeamListRow';
import '../../Rhythmus.css';
import Config from '../../config.js';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
  },
  table: {
    minWidth: 700,
  },
});

class TeamList extends Component {

    constructor(){
        super();
        this.state = {
            teammates:[],
            isLoading:false
        };
    }
    
    onChooseTeammateMonth = (userid, month, year) => {
        this.setState({
            viewTeammate:true,
            userid:userid,
            month:month,
            year:year
        });
    }
    onChooseTeammateKRA = (userid) => {
        //TODO: Open the user KRA details, not review
        console.log("Clicked username to view their kra"+userid);
    }

    onCloseTeammate = () => {
        this.setState({
            viewTeammate:false
        });
    }
  
    componentDidMount() {
        this.setState({isLoading:true});

        let year = 2019;
        fetch(Config.baseURL + '/wp-json/rhythmus/v1/teammate-list?year='+year+'&'+Config.authKey,{
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
                    return (
                        <TeamListRow onChooseTeammateMonth={this.onChooseTeammateMonth} 
                                     onChooseTeammateKRA={this.onChooseTeammateKRA} 
                                     teammate={teammate} year={year}/>
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
            months =[months,<TableCell>{m[i]}</TableCell>];
          }
        return months;
    }

    render() {
        const{isLoading, error, teammates, viewTeammate, userid, month, year} = this.state;
        if(error)
        {
            return <p>{error.message}</p>
        }
        if(isLoading)
        {
            return <p>Loading...</p>;
        }
        if(viewTeammate){
            return(
                <div>
                    <button onClick={this.onCloseTeammate}>Close</button>
                    <TeammateKRAReview userid={userid} month={month} year={year} />
                </div>
            )
        }

        let styles = {
            table: {
              minWidth: 700,
            }};
        return(
        <Table className={styles.table} padding="none" align="center">
            <TableHead>
            <TableRow><TableCell>Name</TableCell>{this.getMonths()}</TableRow>
            </TableHead>
            <TableBody>
          {teammates}
          </TableBody>
      </Table>
        )
    }
}


export default TeamList;