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
        } else if(!isNaN(outof) && outof >= 0) {
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
        if(score === undefined) {
            score = "";
        }
        if(typeof score != 'number')
        {
            score = parseFloat(score);
        }
        let outOfError = false;
        if(amount > outof ||(amount > 0 && !outof)){
            outOfError = true;
        }
        if(score >=0 ) {
            var scoreColorClass = 'score score-';
            if(score<0.3) {
                scoreColorClass += "low";
            } else if (score < 0.7) {
                scoreColorClass += "mid";
            } else {
                scoreColorClass += "high";
            }
            if(score) {
                scoreLabel = <div className={scoreColorClass}>{score}</div>;
            }
        }
        if(amount === undefined){
            amount ="";
        }
        if(!outof){
            outof="";
        }
        return(
            <div align="center">
                <TextField
                    id="amount"
                    value={amount}
                    label="Amount"
                    type="number"
                    className={[classes.textField, classes.inputWidth].join(' ')}
                    onChange={this.handleAmountChange('amount')}
                />
                    <p className={classes.outOf}>out of</p>
                <TextField
                    error={outOfError}
                    id="outof"
                    value={outof}
                    type="number"
                    label="Total"
                    className={[classes.textField, classes.inputWidth].join(' ')}
                    onChange={this.handleOutOfChange('outof')}
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