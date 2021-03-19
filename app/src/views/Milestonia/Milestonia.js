import React, {Component} from 'react';
import '../../Rhythmus.css';
import Config from '../../config.js';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import IconEdit from '@material-ui/icons/EditRounded';
import IconBack from '@material-ui/icons/ArrowBackIosRounded';
import IconNext from '@material-ui/icons/ArrowForwardIosRounded';
import IconAdd from '@material-ui/icons/Add';
import { ButtonGroup } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import IconClose from '@material-ui/icons/CloseRounded';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Link from '@material-ui/core/Link';
import MilestoniaGoal from './MilestoniaGoal';



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
                console.log(goals);
                const canEdit = Config.is_admin || goals.teammate_id === Config.my_teammate_id;
                this.setState({goals:goals, isLoading:false, canEdit:canEdit });
            }
        ).catch(error => this.setState({error, isLoading:false}));
    }


    closeTeammate = () => {
        this.props.onCloseGoal();
    }


    render() {
        const{ isLoading, error, canEdit, goals} = this.state;

        const { teammate_id, classes } = this.props;


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

   
        
        // call Milestonia Goal from inside Milestonia, pass Milestonia to Dashboard

        return(
            <div>
                <Paper className={classes.paper}>
                <h1>milestonia</h1>
                
                {/* set up URL to go to Milestonia goal */}
                {/* URL = https://app.milestonia.com/my-goals */}
                <a href="https://app.milestonia.com/my-goals"><Button variant="outlined">Status Milestones</Button></a>
                <Grid container className={classes.root} spacing={2}>
                <MilestoniaGoal teammate_id={teammate_id}></MilestoniaGoal>
                </Grid>
                </Paper>
            </div>
        )

    }
    
}

Milestonia.propTypes = {
  classes: PropTypes.object.isRequired
  };
  
  export default withStyles(styles)(Milestonia);


//constructor
//component did mount
//render

