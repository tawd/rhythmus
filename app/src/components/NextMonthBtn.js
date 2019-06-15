import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';

class NextMonthBtn extends Component {

    onChooseTeammateNextMonth = () => {
        let nextMonth = this.props.month + 1;
        this.props.onChooseTeammateMonth(this.props.userid, nextMonth, this.props.year);
    }

    render {
        return (
            <Button>Next Month</Button>
        );
    }
    

};

  export default NextMonthBtn;