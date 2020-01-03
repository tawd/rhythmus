import React, {Component} from 'react';
import { withStyles } from '@material-ui/core/styles';
import '../../Rhythmus.css';
import TableCell from '@material-ui/core/TableCell';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Config from '../../config.js';

const styles = theme => ({

});

class WRStatusListRowCol extends Component {

   handleChange = (event, value) => {
       let week_id = this.props.week_id;
       let teammate_id = this.props.teammate_id;
       this.props.handleWRStatusChange(teammate_id, week_id, value.props.value);
   }

   render() {
       let key = this.props.userid+"-"+this.props.week_id;

       let style = {
           textAlign: "center",
           border:"solid 1px #aaa"
       };

       let {canEdit, week} = this.props;
       let cell = "";
       let status = 0;
       if(week) {
            status = week.status;
       }
        let statusVal = parseInt(status);
        if(statusVal === 1 ){ //Submitted
            style["background"] = "rgba(82, 158, 75, 0.5)";//"#529e4b";
        }else if(statusVal ===2 ){ //Out
            style["background"] = "rgba(131, 201, 133, 0.5)";//#83c985";
        }else if(statusVal ===3 ){ //Late
            style["background"] = "rgba(223, 220, 108, 0.5)";//#dfdc6c";
        }else if(statusVal ===0 ){ //Missing
            style["background"] = "rgba(223, 129, 113, 0.5)";//#df8171";
        }
       if(canEdit) {
           cell = (<Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={status}
                        onChange={this.handleChange}
                        >
                            <MenuItem value={0}>{Config.weeklyReportStatus[0]}</MenuItem>
                            <MenuItem value={1}>{Config.weeklyReportStatus[1]}</MenuItem>
                            <MenuItem value={2}>{Config.weeklyReportStatus[2]}</MenuItem>
                            <MenuItem value={3}>{Config.weeklyReportStatus[3]}</MenuItem>
                   </Select>);
       } else {
           cell = Config.weeklyReportStatus[status];
       }

       return (
        <TableCell key={key} style={style} >
            {cell}
        </TableCell>);
   }

}
export default  withStyles(styles)(WRStatusListRowCol);
