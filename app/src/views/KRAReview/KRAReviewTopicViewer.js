import React, {Component} from 'react';
import '../../Rhythmus.css';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

const styles = theme => ({
    container: {
        display: 'flex',
        flexWrap: 'wrap',
  
      }
});


class KRAReviewTopicViewer extends Component {

    splitReturns = (stringVal) => {
        let stringArr = stringVal.split("\n");
        let returnArr = [];
        let d=1;
        stringArr.forEach(element => {
            returnArr.push(element);
            returnArr.push(<br key={d}/>);
            d++;
        });
        return returnArr;
    }
    
    render() {
        const { classes, review, teammate, topic, showMissingScores, showMissingGoals} = this.props;
        let { title} = this.props.topic;
        let { score, amount, outof, goal, goal_notes, notes } = review;

        let goalContent = goal;
        if(!goal && (showMissingGoals || showMissingScores)) {
            goalContent = <div className="error-message">{topic.title}</div>;
        }

        let goalNotesContent = "";
        if(goal_notes) {
            goalNotesContent = <div className="notes">{this.splitReturns(goal_notes)}</div>;
        } else if(showMissingGoals || showMissingScores) {
            goalNotesContent = <div className="error-message">{topic.title} Description</div>;
        }


        let outofFormula = "";

        if(amount !== undefined && amount !== "" && outof !== undefined && outof !==""){
            outofFormula = (<span>{amount} out of {outof}<br/></span>);
        } else if (outof !== undefined && outof !==""){
            outofFormula = (<span>Out of {outof}<br/></span>);
        } else if((showMissingGoals || showMissingScores) && topic.type === "outof") {
            outofFormula = <div className="error-message">{topic.title} Out Of</div>;
        }

        
        var scoreColorClass = 'score score-';
        if(score<0.3) {
            scoreColorClass += "low";
        } else if (score < 0.7) {
            scoreColorClass += "mid";
        } else {
            scoreColorClass += "high";
        }
        let scoreContent = "";
        if(score && score > 0) {
            scoreContent = <div className={scoreColorClass}>{score}</div>;
        } else if(showMissingScores) {
            scoreContent = <div className="error-message">{topic.title} Score</div>;
        }
        
        let scoreNotesContent = "";
        if(score && notes) {
            scoreNotesContent = <div className="notes">{notes}</div>;
        } else if(showMissingScores) {
            scoreNotesContent = <div className="error-message">{topic.title} Score Notes</div>;
        }

        if(topic.source === "kra-titles") {
            if(teammate && teammate.kra){
                goalContent = teammate.position;
                goalNotesContent = [];
                for( let i = 0; i < 3; i++ ){
                    let area = teammate.kra[i];
                    if(area && area.title) {
                        goalNotesContent.push(<div className="notes" key={i}>{area.title}<br/></div>);
                    }
                }
            }
        }

        return(
            <Grid item md={3} sm={12} className={classes.gridStyles}>
                <h3 className="topic-title">{title}</h3>
                <div className="topic">{goalContent}</div>
                {goalNotesContent}
                {scoreContent}
                {outofFormula}
                {scoreNotesContent}
            </Grid>
        );
    }
}

KRAReviewTopicViewer.propTypes = {
classes: PropTypes.object.isRequired
};

export default withStyles(styles)(KRAReviewTopicViewer);
