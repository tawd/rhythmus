import React, {Component} from 'react';
import WRStatusListRowCol from './WRStatusListRowCol';
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
const nameStyleComplete = {
    textAlign: "center",
    border:"solid 1px #aaa",
};

const nameStylePending = {
    textAlign: "center",
    border:"solid 1px #aaa",
    backgroundColor: "#d6d979"
};

const nameStyleLate = {
    textAlign: "center",
    border:"solid 1px #aaa",
    backgroundColor: "#e37f7f"
};

class WRStatusListRow extends Component {

    handleWRStatusChange = (teammate_id, week_id, status) => {
        this.props.handleWRStatusChange(teammate_id, week_id, status);
    }

    render() {
        let { classes, teammate, weeks, canEdit } = this.props;


        let weekCols = [];
        let handleWRStatusChange = this.handleWRStatusChange;
        let numLate = 0;
        let numMissing = 0;

        weeks.forEach(function(week) {
            let teammateWeek = teammate.weeks[week.week_id];
            let key = teammate.userid +"-"+week.week_id;
            let status = 0;
            if(teammateWeek) {
                    status = teammateWeek.status;
            }
            let statusVal = parseInt(status);
            if(statusVal === 3) {
                numLate++;
            } else if(statusVal === 0) {
                numMissing++;
            }
            weekCols.push(<WRStatusListRowCol key={key} canEdit={canEdit} handleWRStatusChange={handleWRStatusChange}
                teammate_id={teammate.teammate_id} week_id={week.week_id} week={teammateWeek} />);
        });
        let style = {};
        if((numLate <=1 && numMissing === 0)){
            style = nameStyleComplete;
        } else if((numLate + numMissing) < 2) {
            style = nameStylePending;
        } else if((numLate + numMissing) >= 2) {
            style = nameStyleLate;
        }
        let classesForThis = "";
        if(this.props.background){
            classesForThis = classes.shadedRow;
        }
        return (
            <TableRow className={classesForThis} key={teammate.userid}>
                <TableCell key={"name-"+teammate.userid} style={style}>{teammate.name}</TableCell>
                {weekCols}
            </TableRow>);
    }
}
export default withStyles(styles)(WRStatusListRow);