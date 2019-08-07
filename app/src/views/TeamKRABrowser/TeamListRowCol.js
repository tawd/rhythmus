 import React, {Component} from 'react';
 import { withStyles } from '@material-ui/core/styles';
import '../../Rhythmus.css';
import classNames from 'classnames';
import TableCell from '@material-ui/core/TableCell';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

const styles = theme => ({
    scoreCell : {
        padding: '4px 24px',
        textAlign: 'center',
        width: '150px',
    },

    scoreBtn: {
        background: 'rgba(255,255,255,0)',
        textAlign: 'center',
        cursor: 'pointer',
        textDecoration: 'underline',
        boxShadow: 'none',
        width: '90%',
        '&:hover': {
            backgroundColor: 'transparent',
         },
    },

    score4: {
        background: 'linear-gradient(55deg, #68b758 0%,#79d367 100%)',
        boxShadow: '0px 1px 5px 0px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 3px 1px -2px rgba(0,0,0,0.12)',
    },

    score3: {
        background: 'linear-gradient(55deg, #83c985 0%,#92dd9b 100%)',
        boxShadow: '0px 1px 5px 0px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 3px 1px -2px rgba(0,0,0,0.12)',
    },

    score2: {
        background: 'linear-gradient(55deg, #dfdc6c 0%,#f5f779 100%)',
        boxShadow: '0px 1px 5px 0px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 3px 1px -2px rgba(0,0,0,0.12)',
    },

    score1: {
        background: '#df8171',
        boxShadow: '0px 1px 5px 0px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 3px 1px -2px rgba(0,0,0,0.12)',
    },

    score0: {
        background: '#fff',
        boxShadow: '0px 1px 5px 0px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 3px 1px -2px rgba(0,0,0,0.12)',
    },

    scoreReviewed: {
        textDecoration: 'none',
    },
    
});



const styles = theme => ({
    reviewedIndicator: {textDecoration: "underline"},

});



class TeamListRowCol extends Component {

    onChooseTeammateMonth = () => {
        this.props.onChooseTeammateMonth(this.props.userid, this.props.month, this.props.year);
    }

    render() {
        let { classes } = this.props;

        let key = this.props.userid+"-"+this.props.year+"-"+this.props.month;
        
        let score = this.props.score;
        
        let scoreVal = "";
<<<<<<< HEAD

        let reviewed = true;
        let scoreClass = {}

        if(score) {
            scoreVal = score.score;
            scoreVal = parseFloat(scoreVal);
            reviewed = score.reviewed;

            if(scoreVal === 4) {
                scoreClass[classes.score4] = true;
            } else if(scoreVal >= 3) {
                scoreClass[classes.score3] = true;
            } else if(scoreVal >= 2) {
                scoreClass[classes.score2] = true;
            } else if (scoreVal >=1) {
                scoreClass[classes.score1] = true;
            }

            scoreClass[classes.scoreReviewed] = reviewed;
=======
        
        let style = {
            background: "white",
            textAlign: "center",
            cursor: "pointer"
        };

        let {classes} = this.props;
        let storeClass = {};
        if(score) {
            
            scoreVal = parseFloat(score.score);
            if(scoreVal === 4 ){
                style["background"] = "#529e4b";
            }else if(scoreVal >=3 ){
                style["background"] = "#83c985";
            }else if(scoreVal >=2 ){
                style["background"] = "#dfdc6c";
            }else if(scoreVal >=1 ){
                style["background"] = "#df8171";
            }        
               //console.log(classes.reviewedIndicator)
                storeClass[classes.reviewedIndicator]=score.reviewed
                
               
            
            
>>>>>>> 7ba007e6f3588960dbb32bff39a8366781fd1f3e
        }
        

<<<<<<< HEAD
        return (
            <TableCell key={key} className={classes.scoreCell}>
                <Button variant='contained' onClick={this.onChooseTeammateMonth} className={ classNames (classes.scoreBtn, scoreClass ) }>{scoreVal}</Button>
            </TableCell>
        );
    }

}
export default withStyles(styles)(TeamListRowCol);
=======
        return (<TableCell key={key} style={style} className={classNames(storeClass)} onClick={this.onChooseTeammateMonth}>{scoreVal}</TableCell>);
    }

}
export default  withStyles(styles)(TeamListRowCol);
>>>>>>> 7ba007e6f3588960dbb32bff39a8366781fd1f3e
