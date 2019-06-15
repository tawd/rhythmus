import React, {Component} from 'react';
import KRAReviewEditor from '../KRAReview/KRAReviewEditor';
import TeamListRow from './TeamListRow';
import '../../Rhythmus.css';
import Config from '../../config.js';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import CircularProgress from '@material-ui/core/CircularProgress';

const styles = theme => ({
    mainTable: {
        border: 0,
        borderRadius: 6,
        boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
        background: '#fff',
      },
});

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
        let { classes } = this.props;
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
                    <KRAReviewEditor userid={userid} month={month} year={year} onChooseTeammateMonth={this.onChooseTeammateMonth} onCloseTeammate={this.onCloseTeammate}/>
            )
        }
        let today = new Date();
        let currYear = today.getFullYear();
        let currMonth = today.getMonth() + 1;
        
        let numCols;
        
        let width = this.props.width;

        if(width > 1200) {
            numCols = 8;
        } else if(width < 1200 && width > 1160) {
           numCols = 7;
        } else if(width < 1160 && width > 800) {
            numCols = 5;
        } else if(width < 800 && width > 690){
            numCols = 4;
        } else if(width < 690 && width > 580) {
            numCols = 3;
        } else if(width < 580 && width > 466) {
            numCols = 2;
        } else if(width < 466) {
            numCols = 1;
        }
        
        let shaded = true;

        let teammateRowss = teammates.map((teammate) => {
            shaded = !shaded;
            return (<TeamListRow background={shaded} key={teammate.userid} onChooseTeammateMonth={this.onChooseTeammateMonth} 
                             onChooseTeammateKRA={this.onChooseTeammateKRA} 
                             teammate={teammate} year={currYear} month={currMonth} numCols={numCols}/>);
        });
        let monthHeadings = this.getMonths(currYear, currMonth, numCols);

        return(
        <Table className={classes.mainTable} align="center">
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

export default withStyles(styles)(TeamListView);