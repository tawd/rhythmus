import React from 'react';
import './Rhythmus.css';
import CssBaseline from '@material-ui/core/CssBaseline';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import TeamListView from './views/TeamKRABrowser/TeamListView';


function TabContainer(props) {
  return (
    <Typography component="div" style={{ padding: 8 * 3 }}>
      {props.children}
    </Typography>
  );
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
};

const styles = theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
});


class Rhythmus extends React.Component {
  constructor(){
    super();
    this.state = {
      value: 0
    };
  }

  handleChange = (event, value) => {
    this.setState({ value });
  };

  componentDidMount() {

  }

  viewKRAReviews = () => {
    this.setState({value:0});
  }
  viewWeeklyReports = () => {
    this.setState({cvalue:1});
  }
  viewMyKRA = () => {
    this.setState({ value:2});
  }


  render() {
    const { classes } = this.props;
    const { value } = this.state;

    return (
    <React.Fragment>
      <CssBaseline />
      <div className={classes.root}>
        <AppBar position="static">
          <Tabs value={value} onChange={this.handleChange}>
            <Tab label="KRA Reviews" />
            <Tab label="Weekly Reports" />
            <Tab label="My KRA" />
          </Tabs>
        </AppBar>
        {value === 0 && <TabContainer><TeamListView /></TabContainer>}
        {value === 1 && <TabContainer>Weekly Reports</TabContainer>}
        {value === 2 && <TabContainer>My KRA</TabContainer>}
      </div>
      </React.Fragment>
    );
  }
}

Rhythmus.propTypes = {
  classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(Rhythmus);
