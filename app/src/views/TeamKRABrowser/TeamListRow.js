import React, {Component} from 'react';
import TeamListRowCol from './TeamListRowCol';
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
        let scores = teammate.scores;
        let scoreCols = [];
        let idprefix = teammate.userid+"-"+year+"-";

        scoreCols.push(<TableCell key={"name-"+teammate.userid} onClick={this.onChooseTeammateKRA}>{teammate.name}</TableCell>)
        for (let i = 1; i <= 12; i++) {
            scoreCols.push(<TeamListRowCol key={idprefix+i} onChooseTeammateMonth={this.onChooseTeammateMonth} 
                                onChooseTeammateKRA={this.onChooseTeammateKRA}
                                userid={teammate.userid} month={i} year={year} score={scores[i]} />);
        }
        return (<TableRow key={teammate.userid}>{scoreCols}</TableRow>);
    }

}
export default TeamListRow;