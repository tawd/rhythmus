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

class WRStatusListRow extends Component {

    handleWRStatusChange = (teammate_id, week_id, status) => {
        this.props.handleWRStatusChange(teammate_id, week_id, status);
    }

    render() {
        let { classes, teammate, weeks, canEdit } = this.props;

        let style = nameStyle;
        if(false){
            style = nameStyleReviewed;
        } else if(false) {
            style = nameStyleSubmitted;
        }

        let weekCols = [];
        let handleWRStatusChange = this.handleWRStatusChange;

        weekCols.push(<TableCell key={"name-"+teammate.userid} style={style}>{teammate.name}</TableCell>);
        weeks.forEach(function(week) {
            let teammateWeek = teammate.weeks[week.week_id];
            let key = teammate.userid +"-"+week.week_id;
            weekCols.push(<WRStatusListRowCol key={key} canEdit={canEdit} handleWRStatusChange={handleWRStatusChange}
                teammate_id={teammate.teammate_id} week_id={week.week_id} week={teammateWeek} />);
        });
        let classesForThis = "";
        if(this.props.background){
            classesForThis = classes.shadedRow;
        }
        return (<TableRow className={classesForThis} key={teammate.userid}>{weekCols}</TableRow>);
    }
}
export default withStyles(styles)(WRStatusListRow);