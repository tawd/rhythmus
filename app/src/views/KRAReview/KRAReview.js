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
import IconClose from '@material-ui/icons/CloseRounded';
import IconNext from '@material-ui/icons/ArrowForwardIosRounded';
import IconBack from '@material-ui/icons/ArrowBackIosRounded';
import IconEdit from '@material-ui/icons/EditRounded';
import IconStar from '@material-ui/icons/StarsRounded';
import Goal from './../Goal/Goal.js';
import Milestonia from './../Milestonia/Milestonia.js';

import { ButtonGroup } from '@material-ui/core';

const styles = theme => ({
    container: {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'space-between'
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
          isEditing:false,
          previousAndNextTeammate:false,
          canEdit:false
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

    this.loadKRAData(userid, year, month)
  }

  loadKRAData = (userid, year, month) => {
    
    this.setState({isLoading:true, month:month, year:year, teammate_id:userid});
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
                teammate.months[year+"-"+month] = review;
                this.setState({review:review});
            }
            const canEdit = Config.is_admin || teammate.userid === Config.my_teammate_id;
            const previousAndNextTeammate = this.getNextPrevTeammates();
            this.setState({teammate:data,isLoading:false,canEdit:canEdit, previousAndNextTeammate:previousAndNextTeammate});
        }
    ).catch(error => this.setState({error, isLoading:false}));
  }

onChooseTeammateNextMonth = () => {
    let nextMonth = this.getNextMonth();
    this.props.onChooseTeammateMonth(this.props.userid, nextMonth.month, nextMonth.year);
}

onChooseTeammatePrevMonth = () => {
    let prevMonth = this.getPreviousMonth();
      if(prevMonth) {
          this.props.onChooseTeammateMonth(this.props.userid, prevMonth.month, prevMonth.year);
      }
  }

onChooseTeammateNext = () => {
    let { year, month } = this.props;
    let {previousAndNextTeammate} = this.state;
    let uid = previousAndNextTeammate.next.userid;
    this.props.onChooseTeammateMonth(uid, month, year);
    this.loadKRAData(uid, month, year);
}

onChooseTeammatePrev = () => {
    let { year, month } = this.props;
    let {previousAndNextTeammate} = this.state;
    let uid = previousAndNextTeammate.prev.userid;
    this.props.onChooseTeammateMonth(uid, month, year);
    this.loadKRAData(uid, month, year);
}

getNextPrevTeammates = () => {
    const {teammates, userid} = this.props;
    var found = false;
    var retVal = {};
    var prev = false;
    teammates.map((teammate) => {
        if(found){
            retVal.next = teammate;
            found = false;
        }
        if(teammate.userid === userid){
            found = true;
            if(prev){
                retVal.prev = prev;
            }
        }
        prev = teammate;
        return teammate;
    });
    return retVal;

}

  getNextMonth = () => {
    let nextMonth = this.props.month + 1;
    let year = this.props.year;
    if(nextMonth > 12){
        nextMonth = 1;
        year = year + 1;
    }
    return {"month":nextMonth, "year":year};
  }

  getPreviousMonth = () => {
    let prevMonth = this.props.month - 1;
    let year = this.props.year;
    if(prevMonth < 1){
        year = year - 1;
        prevMonth = 12;
    }
    return {"month":prevMonth, "year":year};
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
  markReviewed = () => {
    let review = this.state.review;
    this.props.forceReload();
    review.userid = this.state.teammate_id;
    review.month = this.state.month;
    review.year = this.state.year;
    review.reviewed = true;
    this.setState({review:review});
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
        }
    ).catch(error => this.setState({error}));

}

  render() {

    let { classes, year, month } = this.props;
    const{isLoading, error, teammate, canEdit, previousAndNextTeammate} = this.state;

    const closeBtn = <Button variant="outlined" className={classes.closeBtn} onClick={this.closeTeammate} disabled={this.state.saving} title="Close"><IconClose/></Button>;
    if(error)
    {
        return <p>{error.message}<br/>{closeBtn}</p>
    }
    if(isLoading)
    {
        return <CircularProgress />;
    }

    if(teammate && teammate.name && month && year) {

        let review = teammate && teammate.months && teammate.months[year+"-"+month];
        if(!review){
            review = {};
        }
        let m = Config.monthNames;
        let { reviewed, review_notes,total} = review;
        if( ! reviewed ) {
            reviewed = false;
        }
        if( ! review_notes ) {
            review_notes = "";
        }

        let body = "";
        let viewBtn = <Button className={classes.prevBtn} onClick={this.onViewKRA} disabled={this.state.saving}><IconBack/> Back</Button>;
        if(!this.state.isEditing && !this.state.isSubmitting){
            viewBtn = "";
            body = <KRAReviewViewer review={review} classes={classes} teammate={teammate}></KRAReviewViewer>;
        }

        let editBtn = "";
        if(this.state.isEditing){
            body = <KRAReviewEditor review={review} teammate={teammate} userid={this.props.userid} month={month} year={year} 
                            forceReload={this.props.forceReload} onSaving={this.onSaving}></KRAReviewEditor>;
        }
        else if(canEdit) {
            editBtn = <Button className={classes.prevBtn} onClick={this.onEditKRA} disabled={this.state.saving}><IconEdit/> Edit</Button>;
        }

        let submitBtn = "";
        if(this.state.isSubmitting){
            submitBtn = "";
            body = <KRAReviewEditor submitting={true} review={review} teammate={teammate} userid={this.props.userid} month={month} year={year} 
                            forceReload={this.props.forceReload}  onSaving={this.onSaving}></KRAReviewEditor>;
        }
        if(canEdit) {
            submitBtn = <Button className={classes.prevBtn} onClick={this.onSubmitKRA} disabled={this.state.saving}><IconStar/> Score</Button>;
        }
        
        const nextMonth = this.getNextMonth();
        const nextMonthLabel = m[nextMonth.month - 1] + " " + nextMonth.year;
        //let statement think of like a if statement passing in these values
        let nextMonthReview = teammate && teammate.months && teammate.months[nextMonth.year+"-"+nextMonth.month];
        if(!nextMonthReview){
            nextMonthReview = {};
        }
        const prevMonth = this.getPreviousMonth();
        const prevMonthLabel = m[prevMonth.month - 1] + " " + prevMonth.year;
        var totalContent = '';
        if( total > 3) {
            totalContent = <div className={"score score-high"}>{total}</div>;
        } else if (total > 2) {
            totalContent = <div className={"score score-low"}>{total}</div>;
        } else if (total > 1) {
            totalContent = <div className={"score score-mid"}>{total}</div>;
        }


        let ptBtn = false;
        let ntBtn = false;
        let pn = previousAndNextTeammate;

        if(pn.prev){
            let prevTeammateLabel = pn.prev.name;
            ptBtn = <Button className={classes.prevBtn} onClick={this.onChooseTeammatePrev} disabled={this.state.saving} title={prevTeammateLabel}><IconBack/> {prevTeammateLabel}</Button>

        }
        if(pn.next){
            let nextTeammateLabel = pn.next.name;
            ntBtn = <Button className={classes.nextBtn} onClick={this.onChooseTeammateNext} disabled={this.state.saving} title={nextTeammateLabel}>{nextTeammateLabel} <IconNext/></Button>
        }
        let reviewBtn = false;
        if(Config.is_admin) {
            if(review.reviewed){
                reviewBtn = <div>Reviewed</div>;
            } else {
                reviewBtn =<Button className={classes.prevBtn} onClick={this.markReviewed} title={"Mark Reviewed"} >Mark Reviewed</Button>; 
            }

        }

        return(
            <div>
                <Grid container>
                    <Grid container>
                        <ButtonGroup size="small" aria-label="small button group">
                            {viewBtn}
                            {editBtn}
                            {submitBtn}
                        </ButtonGroup>
                    </Grid>
                    <Grid container justify="flex-end">
                        <ButtonGroup size="small" aria-label="small button group">
                            {ptBtn}
                            {ntBtn}
                            <Button className={classes.prevBtn} onClick={this.onChooseTeammatePrevMonth} disabled={this.state.saving} title={prevMonthLabel}><IconBack/> {prevMonthLabel}</Button>
                            <Button className={classes.nextBtn} onClick={this.onChooseTeammateNextMonth} disabled={this.state.saving} title={nextMonthLabel}>{nextMonthLabel} <IconNext/></Button>
                            {closeBtn}
                        </ButtonGroup>
                    </Grid>
                </Grid>
                <form className={classes.container} noValidate autoComplete="off">
                    <Grid item xs={12}>
                        <Paper className={classes.paper}>
                                    <h2>{teammate.name} for {m[month-1]}, {year}</h2>
                                    {totalContent}
                                    {reviewBtn}
                        </Paper>
                    </Grid>
                </form>
                
                {body}
                <h3 className={classes.nextMonthLbl}>Next Month</h3>
                <KRAReviewViewer review={nextMonthReview} classes={classes} teammate={teammate}></KRAReviewViewer>
                <Milestonia teammate_id={teammate.userid}></Milestonia>
                <Goal teammate_id={teammate.userid}></Goal>
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