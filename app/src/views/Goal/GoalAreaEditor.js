import React, {Component} from 'react';
import '../../Rhythmus.css';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';

const styles = theme => ({
    container: {
      display: 'flex',
      flexWrap: 'wrap',
    },
    dense: {
      marginTop: 19,
    },
    boxStyles: {
        padding: '20px',
    },
    paper: {
        margin: '8px',
    },
    textFieldWrapper: {
        margin:'0 auto',
    },
    textField: {
      width: '100%', 
      marginBottom:'30px'     
    },
    headerTextField: {
      width: '60%',   
      color: 'white',   
    },
    headerStyles: {
        backgroundColor:'#4e5f694d', /*theme.palette.primary.main,*/
        padding: '20px',
        color: 'white',
        transform: 'translate()',
        fontWeight:'500',
        textTransform:'uppercase',
        letterSpacing:'0.1em',
        fontSize:'0.8rem'
    },
    menu: {
      width: 200,
    }
  });

  class KRAAreaEditor extends Component{
    handleChange = name => event => {
        this.props.onGoalDataChange(this.props.topic.name, event.target.value);
    };

    render(){
        const {classes, area, topic} = this.props;
        return(
        <Grid item xs={8} className={classes.textFieldWrapper}>
          
                <TextField
                  id="goal"
                  value={area}
                  label={topic.name}
                  multiline
                  className={classes.textField}
                  onChange={this.handleChange('description')}
                />
          </Grid>
        )
    }

  };

export default withStyles(styles)(KRAAreaEditor);