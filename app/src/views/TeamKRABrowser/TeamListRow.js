import React, {Component} from 'react';
import TeamListRowCol from './TeamListRowCol';
import '../../Rhythmus.css';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({

    shadedRow: {
        backgroundColor: 'rgba(0,0,0,0.1)',
    },

});

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
        
        return (<TableRow className={this.props.background && classes.shadedRow} key={teammate.userid}>{scoreCols}</TableRow>);
    }

}
export default withStyles(styles)(TeamListRow);