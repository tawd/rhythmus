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


    render() {
        const { classes, review } = this.props;
        let { title} = this.props.topic;
        let { score, amount, outof, goal, goal_notes, notes } = review;

        let outofFormula = "";

        if(amount !== undefined && outof !== undefined){
            outofFormula = (<span>{amount} out of {outof}<br/></span>);
        }
        var scoreColorClass = 'score score-';
        if(score<0.3) {
            scoreColorClass += "low";
        } else if (score < 0.7) {
            scoreColorClass += "mid";
        } else {
            scoreColorClass += "high";
        }

        return(
            <Grid item md={3} sm={12} className={classes.gridStyles}>
                <h3 className="topic-title">{title}</h3>
                <div className="topic">{goal}</div>
                <div className="notes">{goal_notes}</div>
                <div className={scoreColorClass}>{score}</div>
                {outofFormula}
                <div className="notes">{notes}</div>
            </Grid>
        );
    }
}

KRAReviewTopicViewer.propTypes = {
classes: PropTypes.object.isRequired
};

export default withStyles(styles)(KRAReviewTopicViewer);
