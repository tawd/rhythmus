import React, {Component} from 'react';
import '../../Rhythmus.css';
import Config from '../../config.js';
import KRAReviewViewer from './KRAReviewViewer';
import KRAReviewEditor from './KRAReviewEditor';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
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
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary,
        marginTop: '10px',
    },
});

class KRAReview extends Component {

  autoSaveTimer = false;

  constructor(){
      super();
      this.state = {
          teammate:{},
          isLoading:false,
          userid:"",
          month:"",
          year:"",
          review:false,
          saving:false,
          open:false,
          isSubmitting:false,
          isEditing:false
      };
  }

  closeTeammate = () => {
    if(!this.state.saving){
        this.props.onCloseTeammate();
    }
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
    let year = this.props.year;
    if(nextMonth > 12){
        nextMonth = 1;
        year = year + 1;
    }
    this.props.onChooseTeammateMonth(this.props.userid, nextMonth, year);
}

  onChooseTeammatePrevMonth = () => {
      let prevMonth = this.props.month - 1;
      let year = this.props.year;
      if(prevMonth < 1){
          year = year - 1;
          prevMonth = 12;
      }
      if(prevMonth) {
          this.props.onChooseTeammateMonth(this.props.userid, prevMonth, year);
      }
  }

  onSaving = (saving) => {
      this.setState({saving:saving});
  }
  onEditKRA = () => {
    this.setState({isEditing:true, isSubmitting:false});
  }
  onSubmitKRA = () => {
    this.setState({isEditing:false, isSubmitting:true});
  }
  onViewKRA = () => {
    this.setState({isEditing:false, isSubmitting:false});
  }

  render() {

    let { classes, year, month } = this.props;
    const{isLoading, error, teammate} = this.state;

    let review = teammate && teammate.months && teammate.months[year+"-"+month];
    if(!review){
        review = {};
    }

    const closeBtn = <Button variant="outlined" className={classes.closeBtn} onClick={this.closeTeammate} disabled={this.state.saving}>Close</Button>;
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
        let { reviewed, review_notes,total} = review;
        if( ! reviewed ) {
            reviewed = false;
        }
        if( ! review_notes ) {
            review_notes = "";
        }

        let body = "";
        let viewBtn = <Button className={classes.prevBtn} onClick={this.onViewKRA} disabled={this.state.saving}>Back to Viewer</Button>;
        if(!this.state.isEditing && !this.state.isSubmitting){
            viewBtn = "";
            body = <KRAReviewViewer review={review} classes={classes}></KRAReviewViewer>;
        }
        let editBtn = <Button className={classes.prevBtn} onClick={this.onEditKRA} disabled={this.state.saving}>Edit</Button>;
        if(this.state.isEditing){
            editBtn = "";
            body = <KRAReviewEditor review={review} teammate={teammate} userid={this.props.userid} month={month} year={year} 
                            forceReload={this.props.forceReload} onSaving={this.onSaving}></KRAReviewEditor>;
        }
        let submitBtn = <Button className={classes.prevBtn} onClick={this.onSubmitKRA} disabled={this.state.saving}>Score</Button>;
        if(this.state.isSubmitting){
            submitBtn = "";
            body = <KRAReviewEditor submitting={true} review={review} teammate={teammate} userid={this.props.userid} month={month} year={year} 
                            forceReload={this.props.forceReload}  onSaving={this.onSaving}></KRAReviewEditor>;
        }

        return(
            <div>
                <Grid container>
                    <Grid item xs={2}>{closeBtn}</Grid>
                    <Grid item xs={2}
                        ><Button className={classes.nextBtn} onClick={this.onChooseTeammateNextMonth} disabled={this.state.saving}>Next Month</Button>
                    </Grid>
                    <Grid item xs={2}>
                        <Button className={classes.prevBtn} onClick={this.onChooseTeammatePrevMonth} disabled={this.state.saving}>Prev Month</Button>
                    </Grid>
                    <Grid item xs={2}>
                        {editBtn}
                    </Grid>
                    <Grid item xs={2}>
                        {submitBtn}
                    </Grid>
                    <Grid item xs={2}>
                        {viewBtn}
                    </Grid>
                </Grid>
                <form className={classes.container} noValidate autoComplete="off">
                    <Grid item xs={12}>
                        <Paper className={classes.paper}>
                                    <h2>{teammate.name} for {m[month-1]}, {year}</h2>
                                    <h3>Total: {total}</h3>
                        </Paper>
                    </Grid>
                </form>
                    {body}
            </div>
        );
        }else {
            return (<CircularProgress />);
        }
    }
}

KRAReview.propTypes = {
classes: PropTypes.object.isRequired
};

export default withStyles(styles)(KRAReview);