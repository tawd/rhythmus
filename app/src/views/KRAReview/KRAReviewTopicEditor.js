import React, {Component} from 'react';
import '../../Rhythmus.css';
import KRAReviewSlider from './KRAReviewSlider';
import KRAReviewOutOf from './KRAReviewOutOf';


import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';

const styles = theme => ({
    container: {
      display: 'flex',
      flexWrap: 'wrap',

    },
    textField: {
      width: '100%',      
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
    headerStyles: {
        backgroundColor: theme.palette.primary.main,
        padding: '20px',
        color: 'white',
        transform: 'translate()',
    },
    boxStyles: {
        padding: '20px',
    },
    scoreStyles: {
        paddingTop: '0',
        [theme.breakpoints.down('sm')]: {
          paddingTop: '50px',
          width: '100%',
        },
    },
    gridStyles: {
        width: '100%',
    },
  });

class KRAReviewTopic extends Component {

    handleChange = name => event => {
        this.props.onReviewTopicChange(this.props.topic.name, name, event.target.value);
    };

    handleScoreChange = (key, val) => {
        this.props.onReviewTopicChange(this.props.topic.name, key, val);
    };

    render() {
        const { classes, review, submitting } = this.props;
        let { title, description, type } = this.props.topic;
        let { score, amount, outof, goal, goal_notes, notes } = review;
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
        if (type === "slider") {
            scoring = <KRAReviewSlider score={score} onChange={this.handleScoreChange} />
        } else if(type === "outof") {
            scoring = <KRAReviewOutOf score={score} amount={amount} outof={outof} onChange={this.handleScoreChange} />;
        }

        if(submitting) {
            return(
                <Grid item xs={12}>
                    <Paper className={classes.paper}>
                        <h3 className={classes.headerStyles}>{title}</h3>
                        <Grid container className={classes.boxStyles}>
                            <Grid item md={4} sm={12} className={classes.gridStyles}>
                                {title}: {goal}<br/>
                                {goal_notes}
                            </Grid>
                            <Grid item md={4} sm={12} className={classes.scoreStyles}>
                                {scoring}
                            </Grid>
                            <Grid item md={4} sm={12} className={classes.gridStyles}>
                                <TextField
                                        id="notes"
                                        value={notes}
                                        label={"Notes"}
                                        className={classes.textField}
                                        onChange={this.handleChange('notes')}
                                    />
                            </Grid>
                            <Grid item md={4} sm={12} className={classes.gridStyles}>
    
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
            )
        } else {
            return(
                <Grid item xs={12}>
                    <Paper className={classes.paper}>
                        <h3 className={classes.headerStyles}>{title}</h3>
                        <Grid container className={classes.boxStyles}>
                            <Grid item md={4} sm={12} className={classes.gridStyles}>
                                <TextField
                                    id="goal"
                                    value={goal}
                                    label={title}
                                    className={classes.textField}
                                    helperText={description}
                                    onChange={this.handleChange('goal')}
                                />
                                <TextField
                                    id="goal_notes"
                                    value={goal_notes}
                                    className={classes.textField}
                                    label={title + " Notes"}
                                    margin="normal"
                                    onChange={this.handleChange('goal_notes')}
                                />
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
            )
        }
    }
}
KRAReviewTopic.propTypes = {
    classes: PropTypes.object.isRequired
};
  
export default withStyles(styles)(KRAReviewTopic);