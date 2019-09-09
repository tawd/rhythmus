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
    dense: {
      marginTop: 19,
    },
    boxStyles: {
        padding: '20px',
    },
    paper: {
        margin: '8px',
    },
    textField: {
      width: '60%',      
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
        this.props.onKRADataChange(this.props.index, name, event.target.value);
    };

    render(){
        const {classes, description, title, index} = this.props;

        return(
        <Grid item xs={12}>
          <Paper className={classes.paper}>
              <h3 className={classes.headerStyles}>
                <TextField
                  id="kraTitle"
                  value={title}
                  label={"Key Results Area "+(index+1)+":"}
                  className={classes.headerTextField}
                  onChange={this.handleChange('title')}
                />
                </h3>
                <Grid item xs={12} className={classes.boxStyles}>
                <TextField
                  id="kraDescription"
                  value={description}
                  label={"Performance Standards for "+(index+1)+":"}
                  multiline
                  className={classes.textField}
                  onChange={this.handleChange('description')}
                />
                </Grid>
            </Paper>
          </Grid>
        )
    }

  };

export default withStyles(styles)(KRAAreaEditor);