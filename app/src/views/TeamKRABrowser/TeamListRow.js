import React, {Component} from 'react';
import TeamListRowCol from './TeamListRowCol';
// eslint-disable-next-line
import KRAEditor from '../KRA/KRAEditor'; 

import '../../Rhythmus.css';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';

class TeamListRow extends Component {

    onChooseTeammateMonth = (userid, month, year) => {
        this.props.onChooseTeammateMonth(userid, month, year);
    }
    onChooseTeammateKRA = () => {
        this.props.onChooseTeammateKRA(this.props.teammate.userid);
    }

    render() {
        let teammate = this.props.teammate;
        let year = this.props.year;
        let month = this.props.month;
        let scores = teammate.months;
        let scoreCols = [];

        scoreCols.push(<TableCell key={"name-"+teammate.userid} onClick={this.onChooseTeammateKRA}>{teammate.name}</TableCell>);
        for (let i = 0; i < this.props.numCols; i++) {
            let currMonth = month - i;
            let currYear = year;
            if(currMonth < 1) {
                currMonth = currMonth + 12;
                currYear = year - 1;
            }
            let currScore = scores[currYear+"-"+currMonth];
            let key = teammate.userid+"-"+currYear+"-"+currMonth;
            scoreCols.push(<TeamListRowCol key={key} onChooseTeammateMonth={this.onChooseTeammateMonth} 
                                onChooseTeammateKRA={this.onChooseTeammateKRA}
                                userid={teammate.userid} month={currMonth} year={currYear} score={currScore} />);
        }
        return (<TableRow key={teammate.userid}>{scoreCols}</TableRow>);
    }

}
export default TeamListRow;