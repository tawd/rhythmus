import React, {Component} from 'react';
import '../../Rhythmus.css';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

const styles = theme => ({
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

        return(
            <Grid item md={4} sm={12} className={classes.gridStyles}>
                <b>{title}</b><br/>
                {goal}<br/>
                {goal_notes}<br/>
                {score}<br/>
                {outofFormula}
                {notes}<br/><br/>
            </Grid>
        );
    }
}

KRAReviewTopicViewer.propTypes = {
classes: PropTypes.object.isRequired
};

export default withStyles(styles)(KRAReviewTopicViewer);
