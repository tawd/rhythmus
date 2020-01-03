import React, {Component} from 'react';
import '../../Rhythmus.css';
import Config from '../../config.js';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import IconEdit from '@material-ui/icons/EditRounded';
import IconBack from '@material-ui/icons/ArrowBackIosRounded';
import { ButtonGroup } from '@material-ui/core';
import GoalEditor from './GoalEditor.js';
import GoalViewer from './GoalViewer.js';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import IconClose from '@material-ui/icons/CloseRounded';


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


class Goal extends Component {

    constructor(){
        super();
        this.state = {
            teammate:{},
            isLoading:false,
            userid:"",
            month:"",
            year:"",
            isDirty:false,
            saving:false,
            canEdit:false
        };
    }
    
    handleChange = name => event => {
        let goal = this.state.goal;
        goal[name] = event.target.value;
        this.setState({ goal: goal });
        this.markForSave();
    };
    handleCheckChange = name => event => {
        let goal = this.state.goal;
        goal[name] = event.target.checked;
        this.setState({ goal: goal });
        this.markForSave();
    };

    componentDidMount() {
        this.setState({isLoading:true});
 
        this.loadGoals();
    }

    loadGoals() {
        let {teammate_id} = this.props;
        if(! teammate_id ) {
            teammate_id = Config.my_teammate_id;
        }
        this.setState({isLoading:true, teammate_id:teammate_id});
        let params = "teammate_id=" + teammate_id;

        fetch(Config.baseURL + '/wp-json/rhythmus/v1/goal?'+params+'&'+Config.authKey,{
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
                let goal = data;
                const canEdit = Config.is_admin || goal.teammate_id === Config.my_teammate_id;
                this.setState({goal:goal, isLoading:false, canEdit:canEdit });
            }
        ).catch(error => this.setState({error, isLoading:false}));
    }


    onSaving = (saving) => {
        this.setState({saving:saving});
    }
    onEditGoal = () => {
      this.setState({isEditing:true});
    }
    onViewGoal = () => {
      this.setState({isEditing:false});
    }

    closeTeammate = () => {
        this.props.onCloseGoal();
    }

    render() {
        const{ isLoading, error, canEdit, goal} = this.state;

        const { classes } = this.props;

        let body = "";

        if(error)
        {
            return <p>{error.message}</p>
        }
        if(isLoading)
        {
            return <CircularProgress />;
        }

        let closeBtn = "";
        if(this.props.onCloseGoal) {
            closeBtn = <Button variant="outlined" className={classes.closeBtn} onClick={this.closeTeammate} disabled={this.state.saving} title="Close"><IconClose/></Button>;
        }

        let viewBtn = <Button onClick={this.onViewGoal} disabled={this.state.saving}><IconBack/> Back</Button>;
        if( ! this.state.isEditing ){
            viewBtn = "";
            body = <GoalViewer goal={goal} classes={classes}></GoalViewer>;
        }

        let editBtn = "";
        if(this.state.isEditing){
            body = <GoalEditor goal={goal} onSaving={this.onSaving}></GoalEditor>;
        }
        else if(canEdit) {
            editBtn = <Button className={classes.prevBtn} onClick={this.onEditGoal} disabled={this.state.saving}><IconEdit/> Edit</Button>;
        }

        let create_date = "";
        var dateFormat = require('dateformat');
        if(goal && goal.create_date){
            let d = new Date(goal.create_date.replace(/-/g, '/'));
            create_date = dateFormat(d, "m/d/yy");
        }

        return(
            <div>
                <Paper className={classes.paper}>
                <Grid container>
                    <Grid item xs={12}>
                                    {body}
                    </Grid>
                    <Grid item xs={12}>
                        <div className={classes.paper}>
                            <ButtonGroup size="small" aria-label="small button group">
                                {viewBtn}
                                {editBtn}
                                {closeBtn}
                            </ButtonGroup>
                            <br/>
                            {create_date}
                        </div>
                    </Grid>
                </Grid>
                </Paper>
            </div>
        )
    }
    
}

Goal.propTypes = {
  classes: PropTypes.object.isRequired
  };
  
  export default withStyles(styles)(Goal);