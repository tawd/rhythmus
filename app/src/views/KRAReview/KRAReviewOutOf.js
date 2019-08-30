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
        }
    },
    outOf: {
        display: 'inline-flex',
        padding: '10px',
    },
    inputWidth: {
        width: '70px',
    },
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
            <div align="center">
                <TextField
                    id="amount"
                    value={amount}
                    label="Amount"
                    className={classes.textField, classes.inputWidth}
                    onChange={this.handleAmountChange('amount')}
                />
                    <p className={classes.outOf}>out of</p>
                <TextField
                    id="outof"
                    value={outof}
                    label="Total"
                    className={classes.textField, classes.inputWidth}
                />
                <br/>
                <p>{scoreLabel}</p>
            </div>
        );
    }
}
                
KRAReviewOutOf.propTypes = {
    classes: PropTypes.object.isRequired
};
  
export default withStyles(styles)(KRAReviewOutOf);