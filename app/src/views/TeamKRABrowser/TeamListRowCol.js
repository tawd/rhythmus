import React, {Component} from 'react';
import '../../Rhythmus.css';
import TableCell from '@material-ui/core/TableCell';

class TeamListRowCol extends Component {

    onChooseTeammateMonth = () => {
        this.props.onChooseTeammateMonth(this.props.userid, this.props.month, this.props.year);
    }

    render() {
        let key = this.props.userid+"-"+this.props.year+"-"+this.props.month;
        let score = this.props.score;
        let scoreVal = "";
        let style = {
            background: "rgba(255,255,255, 0)",
            textAlign: "center",
            cursor: "pointer"
        };
        if(score) {
            scoreVal = score.score;
            scoreVal = parseFloat(scoreVal);
            if(scoreVal === 4 ){
                style["background"] = "#529e4b";
            }else if(scoreVal >=3 ){
                style["background"] = "#83c985";
            }else if(scoreVal >=2 ){
                style["background"] = "#dfdc6c";
            }else if(scoreVal >=1 ){
                style["background"] = "#df8171";
            }
            if(!score.reviewed) {
                style["textDecoration"] = "underline";
            }
        }

        return (<TableCell key={key} style={style} onClick={this.onChooseTeammateMonth}>{scoreVal}</TableCell>);
    }

}
export default TeamListRowCol;