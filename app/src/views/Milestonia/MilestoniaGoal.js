import React, { Component } from "react";
import "../../Rhythmus.css";
import PropTypes from "prop-types";
import CircularProgress from "@material-ui/core/CircularProgress";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";

const styles = (theme) => ({
  container: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  textField: {
    width: 200,
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

class MilestoniaGoal extends Component {
  constructor() {
    super();
    this.state = {
      goal: false,
    };
  }

  render() {
    const { goal } = this.props;

    if (!goal) {
      return <div />;
    }

    let goalValue = Math.round(goal.current_value/goal.goal_value * 100, 2);

    return (
      <Grid item sm={12} md >
        <Box position="relative" display="inline-flex">
          <CircularProgress variant="determinate" value={goalValue} />
          <Box
            top={0}
            left={0}
            bottom={0}
            right={0}
            position="absolute"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Typography variant="caption" component="div" color="textSecondary">{`${Math.round(
              goalValue
            )}%`}</Typography>
          </Box>
        </Box>
        <p>{goal.description}</p>
      </Grid>
    );
  }
}

MilestoniaGoal.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(MilestoniaGoal);
