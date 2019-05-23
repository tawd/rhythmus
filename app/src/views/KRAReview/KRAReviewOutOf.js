import React, {Component} from 'react';
import '../../Rhythmus.css';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

const styles = theme => ({
    outof: {
        textField: {
            marginLeft: theme.spacing.unit,
            marginRight: theme.spacing.unit,
            width: 80,
        }
    }
});

class KRAReviewOutOf extends Component {

    handleAmountChange = name => event => {
        let amount = parseFloat(event.target.value);
        if(event.target.value === "") {
            this.props.onChange(name, "");
            this.props.onChange("score", "");
        } else if(!isNaN(amount) && amount >= 0) {
            let score = "";
            this.props.onChange(name, amount);
            amount = parseFloat(amount);
            if(!isNaN(this.props.outof) && this.props.outof > 0 && this.props.outof >= amount) {
                score = ( amount / this.props.outof ).toFixed(2);
            }
            this.props.onChange("score", score);
        }
    };
    handleOutOfChange = name => event => {
        let outof = parseFloat(event.target.value);
        if(event.target.value === "") {
            this.props.onChange(name, "");
            this.props.onChange("score", "");
        } else if(!isNaN(outof) && outof > 0) {
            let score = "";
            this.props.onChange(name, outof);
            if(!isNaN(this.props.amount) && this.props.amount >= 0 && this.props.amount <= outof) {
                score = ( this.props.amount / outof ).toFixed(2);
            }
            this.props.onChange("score", score);
        }
        
        this.props.onChange(name, event.target.value);
    };

    render() {
        let { classes, score, amount, outof } = this.props;
        let scoreLabel = "";
        if(!score) {
            score = "";
        }
        if(typeof score != 'number')
        {
            score = parseFloat(score);
        }
        if(score >=0 ) {
            scoreLabel = "Score: " + score;
        }
        return(
            <div>
                <TextField
                    id="amount"
                    value={amount}
                    label="Amount"
                    className={classes.textField}
                    onChange={this.handleAmountChange('amount')}
                    />
                    out of 
                    <TextField
                    id="outof"
                    value={outof}
                    label="Total"
                    className={classes.textField}
                    onChange={this.handleOutOfChange('outof')}
                    />
                    <br/>
                    {scoreLabel}
            </div>
        );
    }
}
                
KRAReviewOutOf.propTypes = {
    classes: PropTypes.object.isRequired
};
  
export default withStyles(styles)(KRAReviewOutOf);