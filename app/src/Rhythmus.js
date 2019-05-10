import React, {Component}  from 'react';
import './Rhythmus.css';

import TeamList from './views/TeamList';

class Rhythmus extends Component {
  constructor(){
    super();
    this.state = {
        currentView:"teamlist",
        isLoading:false
    };
  }
  componentDidMount() {

  }

  viewMyKRA = () => {
    this.setState({currentView:"kra"});
  }
  viewWeeklyReports = () => {
    console.log(this);
    this.setState({currentView:"weeklyreports"});
  }
  viewKRAReviews = () => {
    this.setState({currentView:"teamlist"});
  }

  onChooseTeammate = (userid) => {

  }

  render() {
    let appView = <p></p>;

    if(this.state.currentView == "teamlist") {
      appView = <TeamList onChooseTeammate={this.onChooseTeammate}/>;
    }

    return (
      <div className="App">
        <header className="App-header">
          
          <p>
            Welcome to the Rhythmus!
          </p>
          <button onClick={this.viewKRAReviews}>KRA Reviews</button>
          <button onClick={this.viewWeeklyReports}>Weekly Reports</button>
          <button onClick={this.viewMyKRA}>My KRA</button>
          {appView}
        </header>
      </div>
    );
  }
}
export default Rhythmus;
