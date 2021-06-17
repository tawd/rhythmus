import React, {Component} from 'react';
import KRAReview from '../KRAReview/KRAReview';
import TeamListRow from './TeamListRow';
import '../../Rhythmus.css';
import Config from '../../config.js';
// eslint-disable-next-line
//import KRAViewer from '../KRA/ViewKRA';
// eslint-disable-next-line
import { withStyles } from '@material-ui/core/styles';
import KRA from '../KRA/KRA';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import CircularProgress from '@material-ui/core/CircularProgress';

const styles = theme => ({

    underline: {
        borderBottom: '2px solid white'
    }

});


class TeamListView extends Component {

    constructor(){
        super();
        this.state = {
            teammates:false,
            viewKRA:false,
            isLoading:false,
            teammate_id:false,
            kra:false,
            canEdit:false,
        };
    }

    onChooseTeammateMonth = (teammate_id, month, year) => {
        this.setState({
            viewTeammate:true,
            teammate_id:teammate_id,
            month:month,
            year:year
        });
    }

    onChooseTeammateKRA = (teammate_id) => {
        this.setState({
            viewKRA:true,
            teammate_id:teammate_id,
            isLoading:true
        });

        let params = "teammate_id=" + teammate_id;
 
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
                const canEdit = Config.is_admin || kra.teammate_id === Config.my_teammate_id;
                this.setState({kra:kra, isLoading:false, canEdit:canEdit });
            }
        ).catch(error => this.setState({error, isLoading:false}));
    }

    onCloseKRA = () => {
        this.setState({
            viewKRA:false
        });
    }

    onCloseTeammate = () => {
        if(this.state.forceReload){
            this.loadData();
        }
        this.setState({
            viewTeammate:false
        });
    }

    componentDidMount() {
        this.loadData();
    }

    forceReload = () => {
        this.setState({forceReload: true});
    }

    loadData = () => {
        this.setState({isLoading:true, forceReload: false});

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
        const{isLoading, error, teammates, viewTeammate,viewKRA, kra, teammate_id, month, year, canEdit} = this.state;

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
                //show the teammate info once selected with set data input
                    <KRAReview forceReload={this.forceReload} teammates={teammates} userid={teammate_id} month={month} year={year} onChooseTeammateMonth={this.onChooseTeammateMonth} onCloseTeammate={this.onCloseTeammate}/>
            )
        }
        if(viewKRA){
            return(
                <KRA teammate_id={teammate_id} kra={kra} teammates={teammates} onChooseTeammateKRA={this.onChooseTeammateKRA} canEdit={canEdit} onCloseKRA={this.onCloseKRA}/>
            )
        }
        let today = new Date();
        let currYear = today.getFullYear();
        let currMonth = today.getMonth() + 1;
        let prevMonth = currMonth - 1;
        let prevYear = currYear;
        if(prevMonth < 1){
            prevYear = prevYear - 1;
            prevMonth = 12;
        }
        currMonth = prevMonth;
        currYear = prevYear;

        let numCols = 8;

        //TODO: This does not appear to be working
        let width = this.props.width;

        if(width < 1200 && width > 1160) {
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

        let teammateRows = teammates.map((teammate) => {
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
          {teammateRows}
          </TableBody>
      </Table>
        )
    }
}

export default withStyles(styles)(TeamListView);