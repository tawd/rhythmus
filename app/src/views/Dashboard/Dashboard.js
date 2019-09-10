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
import { ButtonGroup } from '@material-ui/core';

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

    submitPrevKRA = () => {
        
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
            review = {month:month, year:year};
        }
        let prevMonth = month - 1;
        let prevYear = year;
        
        if(prevMonth < 1){
            prevYear = prevYear - 1;
            prevMonth = 12;
        }
        let prevReview = teammate && teammate.months && teammate.months[prevYear+"-"+prevMonth];
        if(!prevReview){
            prevReview = {month:prevMonth, year:prevYear};
        }
        let position = teammate && teammate.position;
        let kra = teammate && teammate.kra;
        this.setState({review:review, prevReview:prevReview, position:position, kra:kra});
    }

    markSubmitted = () => {
        let review = this.state.review;
        review.submitted = 1;
        this.saveReviewStatus(review);
    }
    markScored = () => {
        let prevReview = this.state.prevReview;
        prevReview.submitted = 2;
        this.saveReviewStatus(prevReview);
    }
    saveReviewStatus = (review) => {
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
        console.log(review);

        const prevTotal = prevReview["total"];

        let readyToScore = false;
        let scoreCompletionStatus = this.checkScoreComplete(prevReview);
        if( scoreCompletionStatus ) {
            scoreCompletionStatus = <div className={"error-message"}>{scoreCompletionStatus}</div>;
        }
        else if(prevReview.submitted !==2 ) {
            readyToScore = true;
        } else {
            scoreCompletionStatus = "Submitted " + prevReview["submit-date"];
        }
        let prevMonthContent=<KRAReviewViewer review={prevReview} teammate={teammate} ></KRAReviewViewer>;
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

        let readyToSubmit = false;
        let goalCompletionStatus = this.checkGoalComplete(review);
        if( goalCompletionStatus ) {
            goalCompletionStatus = <div className={"error-message"}>{goalCompletionStatus}</div>;
        }
        else if(review.submitted !== 1 ) {
            goalCompletionStatus = <Button className={classes.prevBtn} onClick={this.markSubmitted} ><IconStar/> Submit Goals</Button>;
        } else {
            goalCompletionStatus = "Submitted " + review["submit-date"];
        }

        let currMonthContent = <KRAReviewViewer review={review} teammate={teammate} ></KRAReviewViewer>;
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
        
        //let submitDate = new Date(prevReview["submit-date"]);
        //console.log(submitDate);
        // if(submitDate) {
        //     console.log(submitDate.toLocalDateString("en-US"));
        // }

        

        return (
            <div>
                <Paper className={classes.paper}>
                    <h2>My Assessment of {m[prevMonth-1]}, {prevYear}</h2>
                    <div className={scoreColorClass}>{prevTotal}</div>
                        {toggleEditPrevButton} 
                    <br/>
                    {scoreCompletionStatus}
                    {prevMonthContent}
                </Paper>

<br/><br/>
                
                <Paper className={classes.paper}>
                    <h2>My Goals for {m[month-1]}, {year}</h2>
                    <ButtonGroup size="small" aria-label="small button group">
                        {toggleEditCurrButton} 
                    </ButtonGroup>
                    <br/>
                    {goalCompletionStatus}
                    {currMonthContent}
                </Paper>
                

            </div>
        );
    }
}

Dashboard.propTypes = {
classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Dashboard);   