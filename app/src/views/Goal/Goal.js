import React, { Component } from "react";
import "../../Rhythmus.css";
import Config from "../../config.js";
import { rhythmus_api } from "../../RhythmusApi.js";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import Button from "@material-ui/core/Button";
import IconEdit from "@material-ui/icons/EditRounded";
import IconBack from "@material-ui/icons/ArrowBackIosRounded";
import IconNext from "@material-ui/icons/ArrowForwardIosRounded";
import IconAdd from "@material-ui/icons/Add";
import { ButtonGroup } from "@material-ui/core";
import GoalEditor from "./GoalEditor.js";
import GoalViewer from "./GoalViewer.js";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import IconClose from "@material-ui/icons/CloseRounded";

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

class Goal extends Component {
  constructor() {
    super();
    this.state = {
      teammate: {},
      goal: false,
      revision_num: false,
      isLoading: false,
      userid: "",
      month: "",
      year: "",
      isDirty: false,
      saving: false,
      canEdit: false,
    };
  }

  handleChange = (name) => (event) => {
    let goal = this.state.goal;
    goal[name] = event.target.value;
    this.setState({ goal: goal });
    this.markForSave();
  };
  handleCheckChange = (name) => (event) => {
    let goal = this.state.goal;
    goal[name] = event.target.checked;
    this.setState({ goal: goal });
    this.markForSave();
  };

  componentDidMount() {
    this.setState({ isLoading: true });

    this.loadGoals(false);
  }

  loadGoals(revision_num) {
    let { teammate_id } = this.props;
    if (!teammate_id) {
      teammate_id = Config.my_teammate_id;
    }
    this.setState({ isLoading: true, teammate_id: teammate_id, revision_num: revision_num });

    let params = { teammate_id: teammate_id };
    if (revision_num) {
      params.revision_num = revision_num;
    }

    rhythmus_api("goal", params)
      .then((data) => {
        let goal = data;
        const canEdit = Config.is_admin || goal.teammate_id === Config.my_teammate_id;
        this.setState({ goal: goal, isLoading: false, canEdit: canEdit });
      })
      .catch((error) => this.setState({ error, isLoading: false }));
  }

  onSaving = (saving) => {
    this.setState({ saving: saving });
  };
  onEditGoal = () => {
    this.setState({ isEditing: true });
  };
  onViewGoal = () => {
    this.setState({ isEditing: false });
  };

  closeTeammate = () => {
    this.props.onCloseGoal();
  };
  onCreateNewGoals = () => {
    let goal = this.state.goal;
    rhythmus_api("goal-revision", {teammate_id:goal.teammate_id, id : goal.id}, goal)
      .then((data) => {
        if (!data.success) {
          throw new Error("Error saving to server ...");
        }
        this.loadGoals();
        this.onEditGoal();
      })
      .catch((error) => this.setState({ error }));
  };

  onChoosePreviousRevision = () => {
    const { goal } = this.state;
    let revision_num = parseInt(goal.revision_num);
    if (revision_num > 1) {
      revision_num = revision_num - 1;
    }
    this.loadGoals(revision_num);
  };
  onChooseNextRevision = () => {
    const { goal } = this.state;
    let revision_num = parseInt(goal.revision_num);
    const total_revisions = goal.total_revisions;
    if (revision_num < total_revisions) {
      revision_num = revision_num + 1;
    }
    this.loadGoals(revision_num);
  };

  render() {
    const { isLoading, error, canEdit, goal } = this.state;

    const { classes } = this.props;

    let body = "";

    if (error) {
      return <p>{error.message}</p>;
    }
    if (isLoading) {
      return <CircularProgress />;
    }

    if (!goal) {
      return <div />;
    }
    let create_date = "";
    var dateFormat = require("dateformat");
    let isMonthOld = false;
    if (goal && goal.create_date) {
      let d = new Date(goal.create_date.replace(/-/g, "/"));
      create_date = dateFormat(d, "m/d/yy");
      const today = new Date();
      if (today - d > 1000 /*ms*/ * 60 /*s*/ * 60 /*min*/ * 24 /*h*/ * 30 /*days*/) {
        isMonthOld = true;
      }
    }

    let closeBtn = "";
    if (this.props.onCloseGoal) {
      closeBtn = (
        <Button
          variant="outlined"
          className={classes.closeBtn}
          onClick={this.closeTeammate}
          disabled={this.state.saving}
          title="Close"
        >
          <IconClose />
        </Button>
      );
    }

    let viewBtn = (
      <Button onClick={this.onViewGoal} disabled={this.state.saving}>
        <IconBack /> Back
      </Button>
    );
    if (!this.state.isEditing) {
      viewBtn = "";
      body = <GoalViewer goal={goal} classes={classes}></GoalViewer>;
    }

    let addRevisionBtn = "";
    let editBtn = "";
    if (this.state.isEditing) {
      body = <GoalEditor goal={goal} onSaving={this.onSaving}></GoalEditor>;
    } else if (canEdit) {
      if (isMonthOld) {
        addRevisionBtn = (
          <Button onClick={this.onCreateNewGoals} disabled={this.state.saving}>
            <IconAdd /> Create New Goals
          </Button>
        );
      } else {
        editBtn = (
          <Button
            className={classes.prevBtn}
            onClick={this.onEditGoal}
            disabled={this.state.saving}
          >
            <IconEdit /> Edit
          </Button>
        );
      }
    }

    const revision_num = goal.revision_num;
    const total_revisions = goal.total_revisions;
    let prevBtn = "";
    if (revision_num > 1) {
      prevBtn = (
        <Button
          className={classes.prevBtn}
          onClick={this.onChoosePreviousRevision}
          disabled={this.state.saving}
        >
          <IconBack /> Previous Goals
        </Button>
      );
    }
    let nextBtn = "";
    if (revision_num < total_revisions) {
      nextBtn = (
        <Button
          className={classes.nextBtn}
          onClick={this.onChooseNextRevision}
          disabled={this.state.saving}
        >
          Newer Goals <IconNext />
        </Button>
      );
    }

    return (
      <div>
        <Paper className={classes.paper}>
          <Grid container>
            <Grid item xs={12}>
              {body}
            </Grid>
            <Grid item xs={12}>
              <div className={classes.paper}>
                <ButtonGroup size="small" aria-label="small button group">
                  {viewBtn}
                  {editBtn}
                  {addRevisionBtn}
                  {closeBtn}
                </ButtonGroup>
                <br />
                <br />
                <ButtonGroup size="small" aria-label="small button group">
                  {prevBtn}
                  <Button disabled={true}>{create_date}</Button>
                  {nextBtn}
                </ButtonGroup>
              </div>
            </Grid>
          </Grid>
        </Paper>
      </div>
    );
  }
}

Goal.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Goal);
