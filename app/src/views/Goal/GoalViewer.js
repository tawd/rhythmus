import React, {Component} from 'react';
import '../../Rhythmus.css';
import GoalAreaViewer from './GoalAreaViewer';
import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';

const viewerStyle = {
    textAlign: "left",
    marginLeft: "20%",
    marginRight: "20%"
};

class GoalViewer extends Component {

    componentDidMount() {
        
    }

    render() {
        const { classes } = this.props;
        const { goal } = this.props;

        if( !goal || !goal.goals) {
          return "Need goal...";
        }
        let areas = [];
        let i=0;
        
        for (var topic of Object.keys(goal.goals)) {
            areas.push(<GoalAreaViewer key={i}
            index={i}
            title={topic}
            description={goal.goals[topic]}
            />);  
            i++;  
        }
        return( 
            <Grid container>
            <Grid item xs={12}>
                <div className={classes.paper}>
                        <h4>Mission Statement</h4>
                        <div style={viewerStyle}>{goal.mission}</div>
                </div>
                </Grid>
              <Grid item xs={12} style={viewerStyle}>
                {areas}
              </Grid>
            </Grid>);
      
    }
}

GoalViewer.propTypes = {
    classes: PropTypes.object.isRequired
    };
export default GoalViewer;