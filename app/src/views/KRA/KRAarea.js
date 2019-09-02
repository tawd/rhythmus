import React, {Component} from 'react';
import '../../Rhythmus.css';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';



const styles = theme => ({
    container: {
      display: 'flex',
      flexWrap: 'wrap',
    },
    textField: {
      marginLeft: theme.spacing.unit,
      marginRight: theme.spacing.unit,
      width: 400,
    },
    dense: {
      marginTop: 19,
    },
    menu: {
      width: 200,
    }
    // slider: {
    //     padding: '22px 0px',
    //     width:300,
    // },
  });

  class KRAarea extends Component{
    handleChange = name => event => {
      console.log(this.props);
        this.props.onKRADataChange(this.props.index, name, event.target.value);
    };

    handleScoreChange = (key, val) => {
        this.props.onAreaChange(this.props.area.name, key, val);
    };

    render(){
        const {classes, description, title} = this.props;

        return(
          <Grid item xs={12}><Paper className={classes.paper}>
          <br/>
          <TextField
            id="kraTitle"
            value={title}
            label={"KRA Title"}
            className={classes.textField}
            onChange={this.handleChange}
          />
          <br/>
          <br/>
          <TextField
            id="kraDescription"
            value={description}
            label={"KRA description"}
            className={classes.textField}
            onChange={this.handleChange('description')}
          />

          
          </Paper></Grid>
        )
    }

  };


export default withStyles(styles)(KRAarea);