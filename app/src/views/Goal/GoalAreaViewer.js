import React, {Component} from 'react';
import '../../Rhythmus.css';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
    container: {
      display: 'flex',
      flexWrap: 'wrap',
    },
    dense: {
      marginTop: 19,
    },
    menu: {
      width: 200,
    }
  });

  

  class GoalAreaViewer extends Component{
    handleChange = name => event => {
        this.props.onGoalDataChange(this.props.index, name, event.target.value);
    };

    render(){
        const {description, title} = this.props;
        let descBullets = [];

        if(description) {
            let descriptionArr = description.split("\n");
            let d=1;
            descriptionArr.forEach(element => {
                descBullets.push(<li key={d}>{element}</li>);
                d++;
            });
        }

        return(
            <div>
                <h4>{title}</h4>
                <ul>
                    {descBullets}
                </ul>
            </div>
        )
    }

  };

export default withStyles(styles)(GoalAreaViewer);