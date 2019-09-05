import React, {Component} from 'react';
import '../../Rhythmus.css';
import Config from '../../config.js';
import KRAReviewViewer from '../KRAReview/KRAReviewViewer';
import KRAReviewEditor from '../KRAReview/KRAReviewEditor';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';

const styles = theme => ({
    container: {
      display: 'flex',
      flexWrap: 'wrap',
    },
    textField: {
      width: 200,
    },
    dense: {
      marginTop: 19,
    },
    menu: {
      width: 'auto',
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary,
        marginTop: '10px',
    },
});

class Dashboard extends Component {

    constructor(){
        super();
        this.state = {
            teammate:{},
            isLoading:true,
            editingCurrent:false,
            editingPrevious:false,
            saving:false,
            goalError:"",
            scoreError:""
        };
    }
    forceReload = () => {
        //Don't need to reload list for Dashboard
    }
    onSaving = (saving) => {
        this.setState({saving:saving});
    }
    onToggleEditCurr = () => {
        this.setState({editingCurrent:!this.state.editingCurrent});
    }
    onToggleEditPrev = () => {
        this.setState({editingPrevious:!this.state.editingPrevious});
    }

    checkGoalComplete = (review) => {
        if( !review || !review.topics) {
            return "INCOMPLETE - Not Started."
        }
        let retVal = "";
        Config.kraTopics.forEach(function(topic){
            if(!review.topics[topic.name] ) {
                return "INCOMPLETE - Not Started on "+topic.name+".";
            } 
            let tp = review.topics[topic.name];
            if(topic.source !== "kra-titles" && (tp.goal === undefined || tp.goal === "")) {
                retVal = "INCOMPLETE - Unfinished "+topic.name+" goal.";
                return;
            }
            if(topic.source !== "kra-titles" && (tp.goal_notes === undefined || tp.goal_notes === "")) {
                retVal = "INCOMPLETE - Unfinished "+topic.name+" goal notes.";
                return
            }
            if( topic.type === "outof" && (tp.outof === undefined || tp.outof === "")) {
                retVal = "INCOMPLETE - Unfinished "+topic.name+" goal number.";
                return;
            }
        });
        return retVal;
    }

    checkScoreComplete = (review) => {
        let goalStatus = this.checkGoalComplete(review);
        if( goalStatus ) {
            return goalStatus;
        }
        let retVal = "";
        Config.kraTopics.forEach(function(topic){
            let tp = review.topics[topic.name];
            if( tp.notes  === undefined || tp.notes === "") {
                retVal = "INCOMPLETE - Unfinished "+topic.name+" score notes.";
                return;
            }
            if( tp.score  === undefined || tp.score === "" ) {
                retVal = "INCOMPLETE - Unfinished "+topic.name+" score.";
                return;
            }
        });
        return retVal;
    }
          
    componentDidMount() {
        if(!Config.kraTopics) {
            fetch(Config.baseURL + '/wp-json/rhythmus/v1/kra-topics?'+Config.authKey,{
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
                    Config.kraTopics = data.topics;
                    this.loadKRAs();
                }
            ).catch(error => this.setState({error, isLoading:false}));
        } else {
            this.loadKRAs();
        }
    }

    loadKRAs = () => {
        //Don't load dashboard if user not connected
        if(!Config.my_teammate_id) {
            this.setState({isLoading:false});
            return;
        }
        this.setState({isLoading:true});
        let params = "teammate_id="+Config.my_teammate_id;
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
                this.setState({teammate:data,isLoading:false});
            }
        ).catch(error => this.setState({error, isLoading:false}));
    }
    render() {
        const { classes } = this.props;
        const {isLoading, error, teammate} = this.state;
        let m = Config.monthNames;

        let today = new Date();
        let year = today.getFullYear();
        let month = today.getMonth() + 1;
        let review = teammate && teammate.months && teammate.months[year+"-"+month];
        if(!review){
            review = {};
        }
    
        if(!Config.my_teammate_id) {
            return <div>Your account has not been setup. Please contact an admin to connect your account.</div>;
        }
        if(error)
        {
            return <p>{error.message}</p>
        }
        if(isLoading)
        {
            return <CircularProgress />;
        }
        
        const style = {};
    
        let prevMonth = month - 1;
        let prevYear = year;
        
        if(prevMonth < 1){
            prevYear = prevYear - 1;
            prevMonth = 12;
        }
        let prevReview = teammate && teammate.months && teammate.months[prevYear+"-"+prevMonth];
        if(!prevReview){
            prevReview = {};
        }

        const prevTotal = prevReview["total"];

        let prevMonthContent=<KRAReviewViewer review={prevReview} ></KRAReviewViewer>;
        let toggleEditPrevButton = <Button onClick={this.onToggleEditPrev} disabled={this.state.saving}>Reflect & Score</Button>;
        if(this.state.editingPrevious) {
            toggleEditPrevButton = <Button onClick={this.onToggleEditPrev} disabled={this.state.saving}>Back to View</Button>;
            prevMonthContent = <KRAReviewEditor submitting={true} review={prevReview} teammate={teammate} userid={Config.my_teammate_id} month={prevMonth} year={prevYear} 
                            forceReload={this.forceReload} onSaving={this.onSaving}></KRAReviewEditor>;
        }

        let currMonthContent = <KRAReviewViewer review={review} ></KRAReviewViewer>;
        let toggleEditCurrButton = <Button onClick={this.onToggleEditCurr} disabled={this.state.saving}>Set Goals</Button>;
        if(this.state.editingCurrent) {
            toggleEditCurrButton = <Button onClick={this.onToggleEditCurr} disabled={this.state.saving}>Back to View</Button>;
            currMonthContent = <KRAReviewEditor review={review} teammate={teammate} userid={Config.my_teammate_id} month={month} year={year} 
                            forceReload={this.forceReload} onSaving={this.onSaving}></KRAReviewEditor>;
        }


        var scoreColorClass = 'score score-';
        if(prevTotal<2) {
            scoreColorClass += "low";
        } else if (prevTotal < 3) {
            scoreColorClass += "mid";
        } else {
            scoreColorClass += "high";
        }

        let scoreCompletionStatus = this.checkScoreComplete(prevReview);
        if( scoreCompletionStatus ) {
            scoreCompletionStatus = <div className={"error-message"}>{scoreCompletionStatus}</div>;
        }


        let goalCompletionStatus = this.checkGoalComplete(review);
        if( goalCompletionStatus ) {
            goalCompletionStatus = <div className={"error-message"}>{goalCompletionStatus}</div>;
        }

        return (
            <div>
                <Paper className={classes.paper}>
                    <h2>My Assessment of {m[prevMonth-1]}, {prevYear}</h2>
                    <div className={scoreColorClass}>{prevTotal}</div>
                    {toggleEditPrevButton} <br/>
                    {scoreCompletionStatus}
                </Paper>
                {prevMonthContent}

                
                <Paper className={classes.paper}>
                    <h2>My Goals for {m[month-1]}, {year}</h2>
                    {toggleEditCurrButton} <br/>
                    {goalCompletionStatus}
                </Paper>
                {currMonthContent}
                

            </div>
        );
    }
}

Dashboard.propTypes = {
classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Dashboard);   