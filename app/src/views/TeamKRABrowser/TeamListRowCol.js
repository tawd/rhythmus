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
        if(score) {
            scoreVal = score.score;
        }

        return (<TableCell key={key} onClick={this.onChooseTeammateMonth}>{scoreVal}</TableCell>);
    }

}
export default TeamListRowCol;