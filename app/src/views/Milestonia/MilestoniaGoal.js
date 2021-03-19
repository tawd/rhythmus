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




class MilestoniaGoal extends Component {

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

        var i;
        var body = [];
        var goal_value;
        var current_goal;
        var percentage_complete;
        var goal_description;

        function CircularProgressWithLabel(props) {
            return (
              <Box position="relative" display="inline-flex">
                <CircularProgress variant="determinate" {...props} />
                <Box
                  top={0}
                  left={0}
                  bottom={0}
                  right={0}
                  position="absolute"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Typography variant="caption" component="div" color="textSecondary">{`${Math.round(
                    props.value,
                  )}%`}</Typography>
                </Box>
              </Box>
            );
          }
          
          CircularProgressWithLabel.propTypes = {
            /**
             * The value of the progress indicator for the determinate variant.
             * Value between 0 and 100.
             */
            value: PropTypes.number.isRequired,
          };

          //outside loop -> grid set to 12
          //inside loop -> set index i to push into grid box of size 3

        
        

        for(i = 0; i < goals.length; i++) {

            current_goal = goals[i].current_value;
            goal_value = goals[i].goal_value;
            goal_description = goals[i].description;
            
            percentage_complete = Math.round((current_goal/goal_value) * 100);
            

            body.push(
            <Paper className={classes.paper}>
                    <CircularProgressWithLabel value={percentage_complete} />
                    <br></br>
                    <Grid container className={classes.root} spacing={2}>
                    
                    {goal_description}  
                    </Grid>
                    </Paper>
            
        );
        }


        return(
            <div>
                <Paper className={classes.paper}>
                <Grid container className={classes.root} spacing={2}>
                    {body}
                </Grid>
                </Paper>
            </div>
        )

    }
    
}

MilestoniaGoal.propTypes = {
  classes: PropTypes.object.isRequired
  };
  
  export default withStyles(styles)(MilestoniaGoal);


//constructor
//component did mount
//render

