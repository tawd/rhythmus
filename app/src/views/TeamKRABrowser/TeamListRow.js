import React, {Component} from 'react';
import TeamListRowCol from './TeamListRowCol';
// eslint-disable-next-line
import KRAEditor from '../KRA/KRAEditor'; 

import '../../Rhythmus.css';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({

    shadedRow: {
        backgroundColor: 'rgba(0,0,0,0.1)',
    },
    title:{
        border:"solid 1px #aaa",
    }

});
const nameStyle = {
    textAlign: "center",
    border:"solid 1px #aaa",
    cursor: "pointer",
    backgroundColor: "#e37f7f"
};

const nameStyleSubmitted = {
    textAlign: "center",
    border:"solid 1px #aaa",
    cursor: "pointer",
    backgroundColor: "#d6d979"
};

const nameStyleReviewed = {
    textAlign: "center",
    border:"solid 1px #aaa",
    cursor: "pointer"
};

class TeamListRow extends Component {

    onChooseTeammateMonth = (userid, month, year) => {
        this.props.onChooseTeammateMonth(userid, month, year);
    }
    onChooseTeammateKRA = () => {
        this.props.onChooseTeammateKRA(this.props.teammate.userid);
    }

    render() {
        let { classes } = this.props;
        let teammate = this.props.teammate;
        let year = this.props.year;
        let month = this.props.month;
        let scores = teammate.months;
        let scoreCols = [];
        let numCols = this.props.numCols;

        let currScore = scores[year+"-"+month];
        let reviewed = (currScore && currScore.reviewed);
        let submitted = (currScore && currScore.submitted);

        let style = nameStyle;
        if(reviewed){
            style = nameStyleReviewed;
        } else if(submitted) {
            style = nameStyleSubmitted;
        }

        scoreCols.push(<TableCell key={"name-"+teammate.userid} style={style} onClick={this.onChooseTeammateKRA}>{teammate.name}</TableCell>);
        for (let i = 0; i < numCols; i++) {
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
        let classesForThis = "";
        if(this.props.background){
            classesForThis = classes.shadedRow;
        }
        return (<TableRow className={classesForThis} key={teammate.userid}>{scoreCols}</TableRow>);
    }

}
export default withStyles(styles)(TeamListRow);