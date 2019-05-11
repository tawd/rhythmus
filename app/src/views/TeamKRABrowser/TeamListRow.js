import React, {Component} from 'react';
import TeamListRowCol from './TeamListRowCol';
import '../../Rhythmus.css';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';

class TeamListRow extends Component {

    constructor(){
        super();
        this.state = {
            teammate:{}
        };
    }
    
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
        let scoreCols = "";
        
        for (let i = 1; i <= 12; i++) {
            scoreCols =[scoreCols,<TeamListRowCol onChooseTeammateMonth={this.onChooseTeammateMonth} 
                                onChooseTeammateKRA={this.onChooseTeammateKRA}
                                userid={teammate.userid} month={i} year={year} score={scores[i]} />];
        }
        let namekey = "name-"+teammate.userid;
        return (
            <TableRow key={teammate.userid}><TableCell key={namekey} onClick={this.onChooseTeammateKRA}>{teammate.name}</TableCell>{scoreCols}</TableRow>
        );
    }

}
export default TeamListRow;