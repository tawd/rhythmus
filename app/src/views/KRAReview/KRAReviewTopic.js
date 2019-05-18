import React, {Component} from 'react';
import '../../Rhythmus.css';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Slider from '@material-ui/lab/Slider';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';

const styles = theme => ({
    container: {
      display: 'flex',
      flexWrap: 'wrap',
    },
    textField: {
      marginLeft: theme.spacing.unit,
      marginRight: theme.spacing.unit,
      width: 400,
    },
    dense: {
      marginTop: 19,
    },
    menu: {
      width: 200,
    },
    slider: {
        padding: '22px 0px',
        width:300,
    },
  });


class KRAReviewTopic extends Component {

    handleChange = name => event => {
        this.props.onReviewTopicChange(this.props.topic.name, name, event.target.value);
        //this.setState({ [name]: event.target.value });
    };

    handleSliderChange = (event, value) => {
        let key = event.target.id;
        let val = value.toFixed(2);
        this.props.onReviewTopicChange(this.props.topic.name, key, val);
    };
    render() {
        const { classes, review } = this.props;
        let { title, description, type } = this.props.topic;
        let { score, goal, goal_notes } = review;
        if(!score) {
            score = 0.5;
        }
        if(typeof score != 'number')
        {
            score = parseFloat(score);
        }
        if(!goal) {
            goal = "";
        }
        if(!goal_notes) {
            goal_notes = "";
        }
        let scoring;
        if(type === "slider"){
            scoring = <div><Slider
            id="score"
            className={classes.slider}
            value={score}
            min={0}
            max={1}
            step={0.05}
            aria-labelledby="scoring"
            onChange={this.handleSliderChange}
          />
            <p>Score: {score}</p></div>
        } else {
            //TODO: Build out the amount out of scoring interface
            scoring = <div>

            </div>
        }
        return(
            <Grid item xs={12}><Paper className={classes.paper}>
                <h3>{title}</h3>
                <TextField
                    id="goal"
                    value={goal}
                    label={title}
                    className={classes.textField}
                    helperText={description}
                    onChange={this.handleChange('goal')}
                    />
                {scoring}
                <TextField
                    id="goal_notes"
                    value={goal_notes}
                    className={classes.textField}
                    label={title + " Notes"}
                    margin="normal"
                    onChange={this.handleChange('goal_notes')}
                    />
            </Paper></Grid>
        )
    }
}
KRAReviewTopic.propTypes = {
    classes: PropTypes.object.isRequired
};
  
export default withStyles(styles)(KRAReviewTopic);