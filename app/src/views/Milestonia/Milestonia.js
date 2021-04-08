import React, {Component} from 'react';
import '../../Rhythmus.css';
import Config from '../../config.js';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import IconButton from '@material-ui/core/IconButton';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import MilestoniaGoal from './MilestoniaGoal';
import ExitToApp from '@material-ui/icons/ExitToApp';



const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    justify: 'center',
    alignItems: 'center',
    
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
      marginRight: '20px',
      justifyContent: 'center',
      
  },
  root: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  control: {
    padding: theme.spacing(2),
  },
});


class Milestonia extends Component {

    constructor(){
        super();
        this.state = {
            teammate:{},
            goals:false,
            isLoading:false,
        };
    }
    

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

        fetch(Config.baseURL + '/wp-json/rhythmus/v1/milestonia?'+params+'&'+Config.authKey,{
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
                let goals = data;
                this.setState({goals:goals, isLoading:false });
            }
        ).catch(error => this.setState({error, isLoading:false}));
    }


    closeTeammate = () => {
        this.props.onCloseGoal();
    }

    openMilestonia = () => {
      window.open("https://app.milestonia.com/my-goals", "_blank");
    }


    render() {
        const{ isLoading, error, goals} = this.state;

        const { classes } = this.props;


        if(error)
        {
            return <p>{error.message}</p>
        }
        if(isLoading)
        {
            return <CircularProgress />;
        }

        if(!goals) {
            return <div />;
        }

        var body =[];
        var i;
        var totalPriority = 0;
        for(i = 0; i < goals.length; i++) {

          const current_goal = goals[i].current_value;
          const goal_value = goals[i].goal_value;
          const description = goals[i].description;
          const priority = goals[i].priority;
          totalPriority += priority;
          
          const percent_complete = Math.round((current_goal/goal_value) * 100);

          body.push(
            <MilestoniaGoal key={i} description={description} percent_complete={percent_complete} priority={priority} classes={classes}></MilestoniaGoal>
          );
        }
   
        return(
            <div>
                <Paper className={classes.paper}>
                <h1>Milestones
                <IconButton onClick={this.openMilestonia} aria-label="Open Milestonia"><ExitToApp/></IconButton></h1>
                <Grid container className={classes.root} spacing={2}>
                  {body}
                </Grid>
                <br/>Total for Quarter: <strong>{totalPriority} points</strong>
                </Paper>
            </div>
        )
    }
}

Milestonia.propTypes = {
  classes: PropTypes.object.isRequired
  };
  
  export default withStyles(styles)(Milestonia);