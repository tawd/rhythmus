import React, { Component } from "react";
import "../../Rhythmus.css";
import Config from "../../config.js";
import { rhythmus_api } from "../../RhythmusApi.js";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import MilestoniaGoal from "./MilestoniaGoal";

const styles = (theme) => ({
  container: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-evenly",
  },
  textField: {
    width: 200,
  },
  status: {
    marginTop: 0,
    marginBottom: 10,
  },
  dense: {
    marginTop: 19,
  },
  menu: {
    width: "auto",
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary,
    marginTop: "10px",
  },
});

class Milestonia extends Component {
  constructor() {
    super();
    this.state = {
      teammate: {},
      milestonia: false,
      isLoading: false,
    };
  }

  componentDidMount() {
    this.setState({ isLoading: true });
    this.loadMilestonia();
  }

  loadMilestonia() {
    let { teammate_id } = this.props;
    if (!teammate_id) {
      teammate_id = Config.my_teammate_id;
    }
    this.setState({ isLoading: true, teammate_id: teammate_id });

    rhythmus_api("milestonia", { teammate_id: teammate_id })
      .then((data) => {
        let milestonia = data.milestonia;
        this.setState({ milestonia: milestonia, isLoading: false });
      })
      .catch((error) => this.setState({ error, isLoading: false }));
  }

  render() {
    const { isLoading, error, milestonia } = this.state;
    const { classes } = this.props;

    if (error) {
      return <p>{error.message}</p>;
    }

    if (isLoading) {
      return <CircularProgress />;
    }

    if (!milestonia) {
      return <div />;
    }

    let milestoniaGoals = milestonia.map((goal) => {
      return <MilestoniaGoal goal={goal} key={goal.id} />;
    });

    return (
      <div>
        <Paper className={classes.paper}>
          <h2>Milestonia Goals</h2>
          <Button size="small" href="https://app.milestonia.com/my-goals" color="primary" className={classes.status}>
            Status My Milestones
          </Button>
          <Grid className={classes.container} item xs={12}>
            {milestoniaGoals}
          </Grid>
        </Paper>
      </div>
    );
  }
}

Milestonia.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Milestonia);
