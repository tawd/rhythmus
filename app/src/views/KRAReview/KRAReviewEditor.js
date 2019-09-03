import React, {Component} from 'react';
import '../../Rhythmus.css';
import Config from '../../config.js';
import KRAReviewTopicEditor from './KRAReviewTopicEditor';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Grid from '@material-ui/core/Grid';
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
        textAlign: 'center',
        color: theme.palette.text.secondary,
        marginTop: '10px',
    },
  });

class KRAReviewEditor extends Component {

    autoSaveTimer = false;

    constructor(){
        super();
        this.state = {
            teammate:{},
            review:false,
            isDirty:false,
            open:false
        };
    }

    handleChange = name => event => {
        let review = this.state.review;
        review[name] = event.target.value;
        this.setState({ review: review });
        this.markForSave();
    };
    handleCheckChange = name => event => {
        let review = this.state.review;
        review[name] = event.target.checked;
        this.setState({ review: review });
        this.markForSave();
    };
    submitKRAReview = () => {
        console.log("Submit KRA Review");

        //TODO: Validate all fields filled out and submit or show errors
    }

    onReviewTopicChange = (topicKey, key, val) => {
        let review = this.state.review;
        if(!review.topics) {
            review.topics = {};
            //TODO:Set topic in state
        }
        let topic = review.topics[topicKey];
        if(!topic) {
            topic = {};
        }
        topic[key] = val;
        let total = 0;
        Object.keys(review.topics).forEach(function(t){
            let ts = review.topics[t]["score"];
            if(typeof ts != 'number')
            {
                ts = parseFloat(ts);
            }
            if(ts > 0 ) {
                total += ts;
            }
        });
        review.total = total.toFixed(2);
        review.topics[topicKey] = topic;
        this.setState({ review: review });
        this.markForSave();
    }


    markForSave = () => {
        if(!this.state.isDirty) {
            this.setState( { isDirty:true } );
            this.props.onSaving(true);
        }
        if(!this.autoSaveTimer) {
            this.autoSaveTimer = setTimeout(this.handleAutoSave, 1000);
        }
    }

    handleAutoSave = () => {
        this.autoSaveTimer = false;
        this.saveReview();
    }

    saveReview = () => {
        let review = this.state.review;
        this.props.forceReload();
        review.userid = this.props.userid;
        review.month = this.props.month;
        review.year = this.props.year;
        if(!this.unmounting){
            this.setState( {isDirty:false} );
            this.props.onSaving(true);
        }
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
                this.props.onSaving(false);
            }
        ).catch(error => this.setState({error}));

    }

    componentDidMount() {
        this.setState({review: this.props.review});
    }

    componentWillUnmount() {
        if(this.autoSaveTimer){
            clearTimeout(this.autoSaveTimer);
            this.saveReview();
        }
    }

    render() {

        let { classes, year, month, teammate, submitting } = this.props;
        let review = teammate && teammate.months && teammate.months[year+"-"+month];
        if(!review){
            review = {};
        }

        if(teammate && teammate.name && month && year) {
            let onReviewTopicChangeFunction = this.onReviewTopicChange;
            let topicJSX = [];
            let { reviewed, review_notes} = review;
            if( ! reviewed ) {
                reviewed = false;
            }
            if( ! review_notes ) {
                review_notes = "";
            }
            Config.kraTopics.forEach(function(topic){
                let review_topic = false;
                if( review && review.topics && review.topics[topic.name] ) {
                    review_topic = review.topics[topic.name];
                } else {
                    review_topic = {};
                }
                //Don't edit topics that have a source value before submitting
                if(!(topic.source === "kra-titles" && !submitting)) {
                    topicJSX.push(<KRAReviewTopicEditor
                        key={topic.name}
                        topic={topic}
                        submitting={submitting}
                        propName={topic.name}
                        onReviewTopicChange={onReviewTopicChangeFunction}
                        review={review_topic}/>);
                }
            });

            return(
                <div>
                    {topicJSX}
                    <Grid item xs={12}>
                        <FormControlLabel label="Reviewed"
                            control={
                                <Checkbox
                                checked={reviewed}
                                onChange={this.handleCheckChange('reviewed')}
                                value="reviewed"
                                color="primary"
                                />}
                            />
                        <TextField
                            id="review_notes"
                            value={review_notes}
                            label="Review Notes"
                            className={classes.textField}
                            onChange={this.handleChange('review_notes')}
                            />
                    </Grid>
                    <Grid item xs={12}>
                        <Button onClick={this.submitKRAReview}>Submit KRA Review</Button>
                    </Grid>
                </div>
            );
        }else {
            return (<CircularProgress />);
        }
    }
}

KRAReviewEditor.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(KRAReviewEditor);