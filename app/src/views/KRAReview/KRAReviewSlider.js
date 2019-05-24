import React, {Component} from 'react';
import '../../Rhythmus.css';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Slider from '@material-ui/lab/Slider';

const styles = theme => ({
    slider: {
        padding: '22px 0px',
        width:300,
    },
  });

class KRAReviewSlider extends Component {

    handleSliderChange = (event, value) => {
        let key = event.target.id;
        let val = value.toFixed(2);
        this.props.onChange(key, val);
    };
    render() {
        let { classes, score } = this.props;
        let scoreLabel = "";
        if(!score) {
            score = 0.5;
        } else {
            if(typeof score != 'number')
            {
                score = parseFloat(score);
            }
            if(score >=0 ) {
                scoreLabel = "Score: " + score;
            }
        }
        return(
            <div>
                <Slider
                    id="score"
                    className={classes.slider}
                    value={score}
                    min={0}
                    max={1}
                    step={0.05}
                    aria-labelledby="scoring"
                    onChange={this.handleSliderChange}
                />
                <br/>
                {scoreLabel}
          </div>
        );
    }
}
                
KRAReviewSlider.propTypes = {
    classes: PropTypes.object.isRequired
};
  
export default withStyles(styles)(KRAReviewSlider);