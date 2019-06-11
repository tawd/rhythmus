 import React, {Component} from 'react';
 import { withStyles } from '@material-ui/core/styles';
import '../../Rhythmus.css';
import classNames from 'classnames';
import TableCell from '@material-ui/core/TableCell';

const styles = theme => ({
    reviewedIndicator: {textDecoration: "underline"},

});



class TeamListRowCol extends Component {

    onChooseTeammateMonth = () => {
        this.props.onChooseTeammateMonth(this.props.userid, this.props.month, this.props.year);
    }

    render() {
        let key = this.props.userid+"-"+this.props.year+"-"+this.props.month;
        let score = this.props.score;
        let scoreVal = "";
        
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
                
               
            
            
        }
        

        return (<TableCell key={key} style={style} className={classNames(storeClass)} onClick={this.onChooseTeammateMonth}>{scoreVal}</TableCell>);
    }

}
export default  withStyles(styles)(TeamListRowCol);