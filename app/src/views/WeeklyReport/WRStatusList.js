import React, {Component} from 'react';
import '../../Rhythmus.css';
import { withStyles } from '@material-ui/core/styles';
import Config from '../../config.js';
import CircularProgress from '@material-ui/core/CircularProgress';
import WRStatusListRow from './WRStatusListRow';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Button from '@material-ui/core/Button';
import IconNext from '@material-ui/icons/ArrowForwardIosRounded';
import IconBack from '@material-ui/icons/ArrowBackIosRounded';
import { ButtonGroup } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';

const styles = theme => ({

    underline: {
        borderBottom: '2px solid white',
    },
    heading3: {
        margin: '5px 0',
    },
    headingText: {
        textAlign: "center"
    }

});

class WRStatusList extends Component {

    constructor(){
        super();
        this.state = {
            teammates:false,
            weeks:false,
            month:"",
            year:"",
            canEdit:false,
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
                let weeks = data.weeks;
                const canEdit = Config.is_admin;
                this.setState({teammates:teammates,weeks:weeks,canEdit:canEdit});
                this.loadThisMonth();
                this.setState({isLoading:false});

            }
        ).catch(error => this.setState({error, isLoading:false}));
    }

    handleWRStatusChange  = (teammate_id, week_id, status) => {

        let teammate = false;
        let teammates = this.state.teammates;
        teammates.forEach(function(tm){
            if(tm.teammate_id === teammate_id) {
                teammate = tm;
            }
        });
        if(!teammate){
            console.log("Error finding teammate "+teammate_id);
            return;
        }

        let week = teammate.weeks[week_id];
        if(!week){
            week ={};
            teammate.weeks[week_id] = week;
        }
        week.status = status;
        this.setState({teammates:teammates});

        let wrStatus = {
            "teammate_id":teammate_id,
            "week_id":week_id,
            "status":status
        };

        fetch(Config.baseURL + '/wp-json/rhythmus/v1/wr-status?'+Config.authKey,{
            method: "POST",
            cache: "no-cache",
            body: JSON.stringify(wrStatus)
        })
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Something went wrong ...');
                }
            })
            .then(data => {
                if( !data.success ) {
                    throw new Error('Error saving to server ...');
                }
            }
        ).catch(error => this.setState({error}));
    }

    loadThisMonth() {
        let today = new Date();
        let currYear = today.getFullYear();
        let currMonth = today.getMonth() + 1;
        this.getWeeks(currMonth, currYear);
    }

    onChooseNextMonth = () => {
        let nextMonth = this.getNextMonth();
        this.getWeeks(nextMonth.month, nextMonth.year);
    }
    
    onChoosePrevMonth = () => {
        let prevMonth = this.getPreviousMonth();
        this.getWeeks(prevMonth.month, prevMonth.year);
    }
    
    getWeeks(month, year){
        let weeks = this.state.weeks;
        let currWeeks = [];
        weeks.forEach(function(m){
            let endDate = new Date(m.end_date);
            if(endDate.getFullYear() === year && (endDate.getMonth()+1) === month) {
                currWeeks.push(m);
            }
        });
        currWeeks.reverse();
        this.setState({currWeeks:currWeeks,month:month,year:year});
    }  

    getNextMonth = () => {
        let nextMonth = this.state.month + 1;
        let year = this.state.year;
        if(nextMonth > 12){
            nextMonth = 1;
            year = year + 1;
        }
        return {"month":nextMonth, "year":year};
    }
    
    getPreviousMonth = () => {
        let prevMonth = this.state.month - 1;
        let year = this.state.year;
        if(prevMonth < 1){
            year = year - 1;
            prevMonth = 12;
        }
        return {"month":prevMonth, "year":year};
    }

    render() {
        let { classes } = this.props;
        const{isLoading, error, teammates, canEdit, currWeeks} = this.state;
        if(error)
        {
            return <p>{error.message}</p>
        }
        if(isLoading || !teammates)
        {
            return <CircularProgress />;
        }

        let shaded = true;

        let teammateRows = teammates.map((teammate) => {
            shaded = !shaded;
             return (<WRStatusListRow canEdit={canEdit} background={shaded} key={"t"+teammate.teammate_id} 
                              handleWRStatusChange={this.handleWRStatusChange} teammate={teammate} weeks={currWeeks}/>);
        });

        var dateFormat = require('dateformat');
        let weekHeadings = currWeeks.map((week) => {
            let startDate = new Date(week.start_date.replace(/-/g, '/'));
            let endDate = new Date(week.end_date.replace(/-/g, '/'));
            let header = dateFormat(startDate, "mmm d") + " to " + dateFormat(endDate, "mmm d yyyy");
           return (<TableCell key={week.week_id}>{header}</TableCell>);
        });
        let m = Config.monthNames;
        const nextMonth = this.getNextMonth();
        const nextMonthLabel = m[nextMonth.month - 1] + " " + nextMonth.year;
        const prevMonth = this.getPreviousMonth();
        const prevMonthLabel = m[prevMonth.month - 1] + " " + prevMonth.year;
        const currLabel = m[this.state.month - 1] + " " + this.state.year +" Weekly Report Status";

        return(
            <div>
                <Grid container>
                    <Grid item xs={8}>
                        <h3 className={classes.heading3}>{currLabel}</h3>
                    </Grid>
                    <Grid item xs={4} container justify="flex-end">
                        <ButtonGroup size="small" aria-label="small button group">
                            <Button className={classes.prevBtn} onClick={this.onChoosePrevMonth} title={prevMonthLabel}><IconBack/> {prevMonthLabel}</Button>
                            <Button className={classes.nextBtn} onClick={this.onChooseNextMonth} title={nextMonthLabel}>{nextMonthLabel} <IconNext/></Button>
                        </ButtonGroup>
                    </Grid>
                </Grid>
                <Table className={classes.mainTable} align="center">
                    <TableHead>
                    <TableRow><TableCell>Name</TableCell>{weekHeadings}</TableRow>
                    </TableHead>
                    <TableBody>
                {teammateRows}
                </TableBody>
                </Table>
            </div>
        )
    }
}

export default  withStyles(styles)(WRStatusList);