import React from 'react';
import './Rhythmus.css';
import CssBaseline from '@material-ui/core/CssBaseline';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
// import { ThemeProvider } from '@material-ui/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import TeamListView from './views/TeamKRABrowser/TeamListView';
import WRStatusList from './views/WeeklyReport/WRStatusList';
import TabContainer from './components/TabContainer';
import KRAEditor from './views/KRA/KRAEditor'

const styles = theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: '#eee',
  },
});

// const theme = createMuiTheme({
//   overrides: {
//       TableCell: { // Name of the component ⚛️ / style sheet
//           root: { // Name of the rule
//               padding: '4px 24px !important', // Some CSS
//           },
//       },
//   },
// });


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
      <>
        <CssBaseline />
          <div className={classes.root}>
            <AppBar position="static">
              <Tabs value={value} onChange={this.handleChange}>
                <Tab label="KRA Reviews" />
                <Tab label="Weekly Reports" />
                <Tab label="My KRA" />
              </Tabs>
            </AppBar>
            {value === 0 && <TabContainer><TeamListView width={this.state.width} /></TabContainer>}
            {value === 1 && <TabContainer><WRStatusList /></TabContainer>}
            {value === 2 && <TabContainer><KRAEditor /></TabContainer>}
          </div>
      </>
    );
  }
}

Rhythmus.propTypes = {
  classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(Rhythmus);
