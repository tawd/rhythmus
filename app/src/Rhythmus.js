import React from 'react';
import './Rhythmus.css';
import CssBaseline from '@material-ui/core/CssBaseline';
import { lightBlue, blueGrey } from '@material-ui/core/colors';
import { ThemeProvider } from '@material-ui/styles';
import { createMuiTheme } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import TeamListView from './views/TeamKRABrowser/TeamListView';
import TabContainer from './components/TabContainer';
import KRA from './views/KRA/KRA';
import Dashboard from './views/Dashboard/Dashboard';
import WRStatusList from './views/WeeklyReport/WRStatusList';

const styles = theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: '#eceef0',
  },
  appBar: {
    backgroundColor: '#10232b'
  }
});

const theme = createMuiTheme({
  palette: {
    primary: blueGrey,
    secondary: lightBlue,
  },
  status: {
    danger: 'orange',
  }, 
});

class Rhythmus extends React.Component {
  constructor(){
    super();
    this.state = {
      value: 0,
      width: 0
    };

    window.addEventListener('resize', this.widthUpdate);
  }

  handleChange = (event, value) => {
    this.setState({ value });
  };

  componentDidMount() {
    this.widthUpdate();
  }

  widthUpdate = () => {
    this.setState({
      width: window.innerWidth
    });
  };

  viewKRAReviews = () => {
    this.setState({value:0});
  }
  viewWeeklyReports = () => {
    this.setState({value:1});
  }
  viewMyKRA = () => {
    this.setState({ value:2});
  }


  render() {
    const { classes } = this.props;
    const { value } = this.state;

    return (
    <React.Fragment>
      <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className={classes.root}>
        <AppBar position="static" className={classes.appBar}>
          <Tabs value={value} onChange={this.handleChange}>
            <Tab label="Dashboard" />
            <Tab label="KRA Reviews" />
            <Tab label="My KRA" />
            <Tab label="Weekly Reports" />
          </Tabs>
        </AppBar>
        {value === 0 && <TabContainer><Dashboard></Dashboard></TabContainer>}
        {value === 1 && <TabContainer><TeamListView /></TabContainer>}
        {value === 2 && <TabContainer><KRA/></TabContainer>}
        {value === 3 && <TabContainer><WRStatusList></WRStatusList></TabContainer>}
      </div>  
      </ThemeProvider>
      
      </React.Fragment>
    );
  }
}

Rhythmus.propTypes = {
  classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(Rhythmus);
