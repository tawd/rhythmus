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
import IconBack from '@material-ui/icons/ArrowBackIosRounded';
import IconEdit from '@material-ui/icons/EditRounded';
import IconStar from '@material-ui/icons/StarsRounded';
import PublishIcon from '@material-ui/icons/Publish';
import { ButtonGroup } from '@material-ui/core';
import Goal from './../Goal/Goal.js';
import Milestonia from './../Milestonia/Milestonia.js';


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
    submitBtn: {
        backgroundColor: '#61dafb',
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
            scoringPrevious:false,
            saving:false,
            goalError:"",
            scoreError:"",
            review:false,
            prevReview:false,
            position:"",
            kra:{}
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
    onToggleScorePrev = () => {
        this.setState({scoringPrevious:!this.state.scoringPrevious});
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
                return;
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
            if( tp && (tp.notes  === undefined || tp.notes === "")) {
                retVal = "INCOMPLETE - Unfinished "+topic.name+" score notes.";
                return;
            }
            if( tp && (tp.score  === undefined || tp.score === "" )) {
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
                this.loadReviews(data);
                this.setState({teammate:data,isLoading:false});
            }
        ).catch(error => this.setState({error, isLoading:false}));
    }

    loadReviews = (teammate) => {
        let today = new Date();
        let year = today.getFullYear();
        let month = today.getMonth() + 1;
        let review = teammate && teammate.months && teammate.months[year+"-"+month];
        if(!review){
            review = {month:month, year:year, teammate_id:Config.my_teammate_id};
        }
        let prevMonth = month - 1;
        let prevYear = year;
        
        if(prevMonth < 1){
            prevYear = prevYear - 1;
            prevMonth = 12;
        }
        let prevReview = teammate && teammate.months && teammate.months[prevYear+"-"+prevMonth];
        if(!prevReview){
            prevReview = {month:prevMonth, year:prevYear, teammate_id:Config.my_teammate_id};
        }
        let position = teammate && teammate.position;
        let kra = teammate && teammate.kra;
        this.setState({review:review, prevReview:prevReview, position:position, kra:kra, prevMonth:prevMonth, prevYear:prevYear});
    }

    markSubmitted = () => {
        let review = this.state.prevReview;
        var time = new Date().getTime() / 1000;
        review["submit-date"] = time;
        review.userid = Config.my_teammate_id;
        review.month = this.state.prevMonth;
        review.year = this.state.prevYear;
        review.submitted = true;        
        this.setState({prevReview:review});
        fetch(Config.baseURL + '/wp-json/rhythmus/v1/kra-review?'+Config.authKey,{
            method: "POST",
            cache: "no-cache",
            body: JSON.stringify(review)
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

    render() {
        const { classes } = this.props;
        const {isLoading, error, teammate, kra} = this.state;
        let {review, prevReview} = this.state;
        let m = Config.monthNames;
        let today = new Date();
        let year = today.getFullYear();
        let month = today.getMonth() + 1;
        let prevMonth = month - 1;
        let prevYear = year;
        if(prevMonth < 1){
            prevYear = prevYear - 1;
            prevMonth = 12;
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
        if(!review || !prevReview){
            return "Reviews not loaded.";
        }

        const prevTotal = prevReview["total"];

        let completionStatus = this.checkScoreComplete(prevReview);
        let goalCompletionStatus = this.checkGoalComplete(review);
        if( completionStatus || goalCompletionStatus) {
            completionStatus = <div className={"error-message"}>INCOMPLETE - Not ready to submit.</div>;
        }
        else if(!prevReview.submitted) {
            completionStatus = <Button className={classes.submitBtn} onClick={this.markSubmitted} ><PublishIcon/> Submit {m[prevMonth-1]} Review & Goals</Button>;
        } else {
            //TODO: Show date
            completionStatus = "KRA Review Submitted";
        }


        let prevMonthContent=<KRAReviewViewer review={prevReview} teammate={teammate} showMissingScores={true}></KRAReviewViewer>;
        let toggleEditPrevButton = <ButtonGroup size="small" aria-label="small button group">
            <Button className={classes.prevBtn} onClick={this.onToggleScorePrev} disabled={this.state.saving}><IconStar/> Reflect & Score</Button>
            <Button className={classes.prevBtn} onClick={this.onToggleEditPrev} disabled={this.state.saving}><IconEdit/> Edit</Button>
            </ButtonGroup>;
        if(this.state.editingPrevious) {
            toggleEditPrevButton = <Button className={classes.prevBtn} onClick={this.onToggleEditPrev} disabled={this.state.saving}><IconBack/> Back to View</Button>;
            prevMonthContent = <KRAReviewEditor kra={kra} review={prevReview} teammate={teammate} userid={Config.my_teammate_id} month={prevMonth} year={prevYear} 
                            forceReload={this.forceReload} onSaving={this.onSaving}></KRAReviewEditor>;
        }
        if(this.state.scoringPrevious) {
            toggleEditPrevButton = <Button className={classes.prevBtn} onClick={this.onToggleScorePrev} disabled={this.state.saving}><IconBack/> Back to View</Button>;
            prevMonthContent = <KRAReviewEditor kra={kra} submitting={true} review={prevReview} teammate={teammate} userid={Config.my_teammate_id} month={prevMonth} year={prevYear} 
                            forceReload={this.forceReload} onSaving={this.onSaving}></KRAReviewEditor>;
        }

        let currMonthContent = <KRAReviewViewer review={review} teammate={teammate} showMissingGoals={true}></KRAReviewViewer>;
        let toggleEditCurrButton = <Button className={classes.prevBtn} onClick={this.onToggleEditCurr} disabled={this.state.saving}><IconEdit/> Set Goals</Button>;
        if(this.state.editingCurrent) {
            toggleEditCurrButton = <Button className={classes.prevBtn} onClick={this.onToggleEditCurr} disabled={this.state.saving}><IconBack/> Back to View</Button>;
            currMonthContent = <KRAReviewEditor kra={kra} review={review} teammate={teammate} userid={Config.my_teammate_id} month={month} year={year} 
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
        

        

        return (
            <div>
                <div className={classes.paper}>{completionStatus}</div>
                <Paper className={classes.paper}>
                    <h2>My Assessment of {m[prevMonth-1]}, {prevYear}</h2>
                    <div className={scoreColorClass}>{prevTotal}</div>
                        {toggleEditPrevButton} 
                    <br/>
                    {prevMonthContent}
                    <h2>My Goals for {m[month-1]}, {year}</h2>
                    <ButtonGroup size="small" aria-label="small button group">
                        {toggleEditCurrButton} 
                    </ButtonGroup>
                    <br/>
                    {currMonthContent}
                </Paper>
                <Goal></Goal>
            </div>
        );
    }
}

Dashboard.propTypes = {
classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Dashboard);   