import React, {Component} from 'react';
import '../../Rhythmus.css';
import TableCell from '@material-ui/core/TableCell';

class TeamListRowCol extends Component {

    onChooseTeammateMonth = () => {
        this.props.onChooseTeammateMonth(this.props.userid, this.props.month, this.props.year);
    }

    render() {

        let key = this.props.userid+"-"+this.props.year+"-"+this.props.month;

        return <TableCell key={key} onClick={this.onChooseTeammateMonth}>{this.props.score}</TableCell>
    }

}
export default TeamListRowCol;