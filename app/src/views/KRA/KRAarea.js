import React, {Component} from 'react';
import '../../Rhythmus.css';
import PropTypes from 'prop-types';
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
        this.props.onAreaChange(this.props.area.name, name, event.target.value);
    };

    handleScoreChange = (key, val) => {
        this.props.onAreaChange(this.props.area.name, key, val);
    };

    render(){
        const {classes, kra} = this.props;
       //  let {name, position} = this.props.kra;
         let {title, description} = KRAarea;

        return(
          <Grid item xs={12}><Paper className={classes.paper}>
          <h3>test to see if it works</h3>
          </Paper></Grid>
          //it works! 
        )
    }

  };


export default withStyles(styles)(KRAarea);