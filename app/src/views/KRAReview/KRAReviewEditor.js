import React, {Component} from 'react';
import '../../Rhythmus.css';
import Config from '../../config.js';
import KRAReviewTopic from './KRAReviewTopic';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Snackbar from '@material-ui/core/Snackbar';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';

const styles = theme => ({
    container: {
      display: 'flex',
      flexWrap: 'wrap',
    },
    textField: {
      marginLeft: theme.spacing.unit,
      marginRight: theme.spacing.unit,
      width: 200,
    },
    dense: {
      marginTop: 19,
    },
    menu: {
      width: 'auto',
    },
    paper: {
        padding: theme.spacing.unit * 2,
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },
  });

class KRAReviewEditor extends Component {

    constructor(){
        super();
        this.state = {
            teammate:{},
            isLoading:false,
            userid:"",
            month:"",
            year:"",
            review:false,
            isDirty:false,
            saving:false,
            opent:false
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

    onReviewTopicChange = (topicKey, key, val) => {
        let review = this.state.review;
        if(!review.topics) {
            review.topics = !!{};
        }
        let topic = review.topics[topicKey];
        if(!topic) {
            topic = {};
        }
        topic[key] = val;
        review.topics[topicKey] = topic;
        this.setState({ review: review });
        this.markForSave();
    }

    handleMessageClose = () => {
        this.setState({ open: false });
    }

    markForSave = () => {
        if(!this.state.open || this.state.isDirty) {
            this.setState( { open:true, isDirty:true } );
        }
    }

    saveReview = () => {
        let review = this.state.review;
        review.userid = this.props.userid;
        review.month = this.props.month;
        review.year = this.props.year;
        this.setState( { open:false} );
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
                console.log(data);
                if( !data.success ) {
                    throw new Error('Error saving to server ...');
                }
                //TODO: Handle the dirty state better...
                this.setState ( {isDirty:false});
            }
        ).catch(error => this.setState({error}));

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

    loadKRAs= () => {
        const{year, userid, month} = this.props;
        this.setState({isLoading:true, month:month, year:year});
        let params = "teammate_id="+userid;
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
                let teammate = data;
                this.setState({teammate:teammate});
                if(teammate && teammate.months) {
                    let review = teammate.months[year+"-"+month];
                    if(!review){
                       review = {};
                    }
                    this.setState({review:review});
                }
                this.setState({teammate:data,isLoading:false});
            }
        ).catch(error => this.setState({error, isLoading:false}));
    
    }


    onChooseTeammateNextMonth = () => {
        let nextMonth = this.props.month + 1;
        this.props.onChooseTeammateMonth(this.props.userid, nextMonth, this.props.year);
    }

    onChooseTeammatePrevMonth = () => {
        let prevMonth = this.props.month - 1;
        if(prevMonth) {
            this.props.onChooseTeammateMonth(this.props.userid, prevMonth, this.props.year);
        } else {
            return '<div>Nothing to see</div>';
        }
    }


    render() {

        let { classes, year, month } = this.props;
        const{isLoading, error, teammate} = this.state;

        let review = teammate && teammate.months && teammate.months[year+"-"+month];
        if(!review){
            review = {};
        }
        
        const closeBtn = <Button variant="outlined" onClick={this.props.onCloseTeammate}>Close</Button>;
        if(error)
        {
            return <p>{error.message}<br/>{closeBtn}</p>
        }
        if(isLoading)
        {
            return <CircularProgress />;
        }
        
        if(teammate && teammate.name && month && year) {
            let m = Config.monthNames;
            let onReviewTopicChangeFunction = this.onReviewTopicChange;
            let topicJSX = [];
            let { reviewed, review_notes,score} = review;
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
                topicJSX.push(<KRAReviewTopic 
                    key={topic.name}  
                    topic={topic}
                    propName={topic.name}
                    onReviewTopicChange={onReviewTopicChangeFunction}
                    review={review_topic}/>)
            });

            return(
                <div>
                    <Grid container>
                        <Grid item xs={12}>{closeBtn}</Grid>
                        <form className={classes.container} noValidate autoComplete="off">
                            <Grid item xs={12}>
                                
                                <Paper className={classes.paper}>
                                    <Button onClick={this.onChooseTeammatePrevMonth}>Prev Month</Button>
                                    <h2>{teammate.name} for {m[month-1]}, {year}</h2>
                                    <h3>Score: {score}</h3>
                                    <Button onClick={this.onChooseTeammateNextMonth}>Next Month</Button>
                                </Paper>
                                
                            </Grid>
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
                        </form>
                    </Grid>
                    <Snackbar
                        anchorOrigin={{ 'vertical':'bottom', 'horizontal':'right' }}
                        key='save-msg'
                        open={this.state.open}
                        onClose={this.handleMessageClose}
                        action={
                            <Button color="primary" size="small" onClick={this.saveReview}>
                              Save
                            </Button>}
                        ContentProps={{
                        'aria-describedby': 'message-id',
                        }}
                        message={<span id="message-id">Changes to save</span>}
                    />
                </div>
            )
        }else {
            return (<CircularProgress />);
        }
    }
}

KRAReviewEditor.propTypes = {
    classes: PropTypes.object.isRequired
};
  
export default withStyles(styles)(KRAReviewEditor);