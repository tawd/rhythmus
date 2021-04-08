import React, {Component} from 'react';
import '../../Rhythmus.css';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

const styles = theme => ({
  container: {
    justifyContent: 'space-between',
    justify: 'center',
    alignItems: 'center',
    
  },
  pointLabel:{
    fontSize:'0.8rem'
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

    render() {
        const { classes, percent_complete, description, priority} = this.props;

        return(
          <Paper className={classes.paper}>
              <Box position="relative" display="inline-flex">
                <CircularProgress variant="determinate" value={percent_complete}/>
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
                  <Typography variant="caption" component="div" color="textSecondary">{`${Math.round(percent_complete,)}%`}</Typography>
                </Box>
              </Box>
              <br/>
                {description}<br/>
                <div className={classes.pointLabel}>{priority} points</div>
            </Paper>
        )
    }
}

MilestoniaGoal.propTypes = {
  classes: PropTypes.object.isRequired
  };
  
  export default withStyles(styles)(MilestoniaGoal);