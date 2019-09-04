import React, {Component} from 'react';
import '../../Rhythmus.css';
import Config from '../../config.js';
import KRAReviewTopicViewer from './KRAReviewTopicViewer';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';


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

class KRAReviewViewer extends Component {

  render() {
    let { classes} = this.props;
    let review = this.props.review;
    let topicJSX = [];


    Config.kraTopics.forEach(function(topic){
      let review_topic = false;
      if( review && review.topics && review.topics[topic.name] ) {
          review_topic = review.topics[topic.name];
      } else {
          review_topic = {};
      }
      topicJSX.push(<KRAReviewTopicViewer
          key={topic.name}
          topic={topic}
          propName={topic.name}
          review={review_topic}/>)
    });


    return(
      <Paper className={classes.paper}>
            <Grid className={classes.container} item xs={12}>
                {topicJSX}
            </Grid>
      </Paper>
    );
  }
}

KRAReviewViewer.propTypes = {
classes: PropTypes.object.isRequired
};

export default withStyles(styles)(KRAReviewViewer);