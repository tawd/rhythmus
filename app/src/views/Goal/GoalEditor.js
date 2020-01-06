import React, {Component} from 'react';
import '../../Rhythmus.css';
import GoalAreaEditor from './GoalAreaEditor';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core/styles';
import Config from '../../config.js';
import CircularProgress from '@material-ui/core/CircularProgress';

const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  dense: {
    marginTop: 19,
  },
  textFieldWrapper: {
    margin:'0 auto',
    display:'flex',
    justifyContent:'space-between'
  },
  textField: {
    width: '100%',      
  },
  menu: {
    width: 200,
  }
});

class GoalEditor extends Component {
  autoSaveTimer = false;

  constructor(){
    super();
    this.state = {
        goal:false,
        isDirty:false,
        isLoading:false,
        open:false
    };
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
      this.saveGoal();
  }

  saveGoal = () => {
      let goal = this.state.goal;
      fetch(Config.baseURL + '/wp-json/rhythmus/v1/goal?'+Config.authKey,{
          method: "POST",
          cache: "no-cache",
          body: JSON.stringify(goal)
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
    let goal = this.props.goal;
    this.setState({goal:goal});
    if(!Config.goalTopics) {
        this.setState({isLoading:true});
        fetch(Config.baseURL + '/wp-json/rhythmus/v1/goal-topics?'+Config.authKey,{
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
                Config.goalTopics = data.topics;
                Config.goalHelp = data.help;
                this.setState({isLoading:false});
            }
        ).catch(error => this.setState({error, isLoading:false}));
    } 
  }

  onGoalDataChange = (name, value) =>
  {
    let goal = this.state.goal;

    goal.goals[name] = value;
    this.setState({ goal: goal });
    this.markForSave();
  }
  handleChange = name => event => {
    let goal = this.state.goal;
    goal[name] = event.target.value;
    this.setState({ goal: goal });
    this.markForSave();
  };

  render() {
    const { classes } = this.props;
    const { goal, isLoading } = this.state;

    if(isLoading)
    {
        return <CircularProgress />;
    }

    if( !goal || !goal.goals) {
      return "Need Goal...";
    }
    let areas = [];
    let i = 0;
    for( i = 0; i < Config.goalTopics.length; i++ ){
        let topic = Config.goalTopics[i];
        let area = goal.goals[topic.name];
        if(!area) {
            area = "";
            goal.goals[topic.name] = area;
        }
        areas.push(<GoalAreaEditor key={i}
            index={i}
            area={area}
            topic={topic}
            onGoalDataChange={this.onGoalDataChange}
            />);
        }
    const createMarkup = htmlString => ({ __html: htmlString });
    return( 
        <Grid container>
          <Grid item xs={12}>
          <h2>Mission Statement</h2>
            <Grid item xs={8} className={classes.textFieldWrapper}>
                <Grid item xs={8}>
                    <TextField
                        id="mission"
                        multiline
                        value={goal.mission}
                        label={"Mission Statement"}
                        className={classes.textField}
                        onChange={this.handleChange('mission')}
                    />
                </Grid>
                <Grid item xs={2}>
                    <TextField
                        id="date"
                        label="Create Date"
                        type="date"
                        value={goal.create_date}
                        className={classes.textField}
                        onChange={this.handleChange('create_date')}
                        InputLabelProps={{
                        shrink: true,
                        }}
                    />
                </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
          <br/><br/>  
            {areas}
            <br/>
            <div dangerouslySetInnerHTML={createMarkup(Config.goalHelp)} />
          </Grid>
        </Grid>)
  }
}

export default withStyles(styles)(GoalEditor);