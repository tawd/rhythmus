import React, {Component} from 'react';
import KRAReviewEditor from '../KRAReview/KRAReviewEditor';
import TeamListRow from './TeamListRow';
import '../../Rhythmus.css';
import Config from '../../config.js';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import CircularProgress from '@material-ui/core/CircularProgress';

class TeamListView extends Component {

    constructor(){
        super();
        this.state = {
            teammates:false,
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
    }

    onCloseTeammate = () => {
        this.setState({
            viewTeammate:false
        });
    }
  
    componentDidMount() {
        this.setState({isLoading:true});

        fetch(Config.baseURL + '/wp-json/rhythmus/v1/teammate-list?'+Config.authKey,{
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

    getMonths(year, month, numCols){
        let m = Config.monthNames;

        let months = [];
        for (let i = 1; i <= numCols; i++) {
            let currMonth = month - i;
            let currYear = year;
            if(currMonth < 0) {
                currMonth = currMonth + 12;
                currYear = year - 1;
            }
            months.push(<TableCell key={"m-"+currMonth}>{m[currMonth]+" "+currYear}</TableCell>);
          }
        return months;
    }

    render() {
        const{isLoading, error, teammates, viewTeammate, userid, month, year} = this.state;
        if(error)
        {
            return <p>{error.message}</p>
        }
        if(isLoading || !teammates)
        {
            return <CircularProgress />;
        }
        if(viewTeammate){
            return(
                    <KRAReviewEditor userid={userid} month={month} year={year} onCloseTeammate={this.onCloseTeammate}/>
            )
        }
        let today = new Date();
        let currYear = today.getFullYear();
        let currMonth = today.getMonth() + 1;
        let numCols = 8;
        let teammateRowss = teammates.map((teammate) => {
            return (<TeamListRow key={teammate.userid} onChooseTeammateMonth={this.onChooseTeammateMonth} 
                             onChooseTeammateKRA={this.onChooseTeammateKRA} 
                             teammate={teammate} year={currYear} month={currMonth} numCols={numCols}/>);
        });
        let monthHeadings = this.getMonths(currYear, currMonth, numCols);

        return(
        <Table padding="none" align="center">
            <TableHead>
            <TableRow><TableCell>Name</TableCell>{monthHeadings}</TableRow>
            </TableHead>
            <TableBody>
          {teammateRowss}
          </TableBody>
      </Table>
        )
    }
}

export default TeamListView;