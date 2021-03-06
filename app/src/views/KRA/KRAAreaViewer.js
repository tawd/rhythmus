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

  

  class KRAAreaViewer extends Component{
    handleChange = name => event => {
        this.props.onKRADataChange(this.props.index, name, event.target.value);
    };

    render(){
        const {description, title, index} = this.props;
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
                <h4>Key Results Area #{(index + 1)}: {title}</h4>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Performance Standards:<br/>
                <ul>
                    {descBullets}
                </ul>
            </div>
        )
    }

  };

export default withStyles(styles)(KRAAreaViewer);