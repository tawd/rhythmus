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
    paper: {
        margin: '8px',
    },
    headerStyles: {
        backgroundColor:'#4e5f69', /*theme.palette.primary.main,*/
        padding: '20px',
        color: 'white',
        transform: 'translate()',
        fontWeight:'500',
        textTransform:'uppercase',
        letterSpacing:'0.1em',
        fontSize:'0.8rem'
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

class KRAReviewTopicEditor extends Component {

    handleChange = name => event => {
        this.props.onReviewTopicChange(this.props.topic.name, name, event.target.value);
    };

    handleScoreChange = (key, val) => {
        this.props.onReviewTopicChange(this.props.topic.name, key, val);
    };

    render() {
        const { classes, review, submitting, teammate, topic} = this.props;
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
        let amountGoal ="";
        if (type === "slider") {
            scoring = <KRAReviewSlider score={score} onChange={this.handleScoreChange} />
        } else if(type === "outof") {
            scoring = <KRAReviewOutOf score={score} amount={amount} outof={outof} onChange={this.handleScoreChange} />;
            amountGoal =<TextField
            id="outof"
            value={outof}
            type="number"
            label="Total Steps in Goal"
            onChange={this.handleChange('outof')}
        />
        }

        if(submitting) {

            if(topic.source === "kra-titles") {
                if(teammate && teammate.kra){
                    goal = teammate.position;
                    goal_notes = [];
                    for( let i = 0; i < 3; i++ ){
                        let area = teammate.kra[i];
                        if(area) {
                            goal_notes.push(<div key={i}>{area.title}<br/></div>);
                        }
                    }
                }
            }

            return(
                <Grid item xs={6}>
                    <Paper className={classes.paper}>
                        <h3 className={classes.headerStyles}>{title}</h3>
                        <Grid container className={classes.boxStyles}>
                            <Grid item md={6} sm={12} className={classes.gridStyles}>
                                <div className="topic">{goal}</div>
                                <div className="notes">{goal_notes}</div>
                            </Grid>
                            <Grid item md={6} sm={12} className={classes.scoreStyles}>
                                {scoring}
                                <TextField
                                        id="notes"
                                        multiline
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
                <Grid item xs={4}>
                    <Paper className={classes.paper}>
                        <h3 className={classes.headerStyles}>{title}</h3>
                        <Grid container className={classes.boxStyles}>
                            <Grid item md={12} sm={12} className={classes.gridStyles}>
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
                                    multiline
                                    value={goal_notes}
                                    className={classes.textField}
                                    label={title + " Description"}
                                    margin="normal"
                                    onChange={this.handleChange('goal_notes')}
                                />
                                {amountGoal}
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
            )
        }
    }
}
KRAReviewTopicEditor.propTypes = {
    classes: PropTypes.object.isRequired
};
  
export default withStyles(styles)(KRAReviewTopicEditor);