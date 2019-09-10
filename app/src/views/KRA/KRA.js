import React, {Component} from 'react';
import '../../Rhythmus.css';
import Config from '../../config.js';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import IconEdit from '@material-ui/icons/EditRounded';
import IconBack from '@material-ui/icons/ArrowBackIosRounded';
import { ButtonGroup } from '@material-ui/core';
import KRAEditor from './KRAEditor.js';
import KRAViewer from './KRAViewer.js';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import IconClose from '@material-ui/icons/CloseRounded';


const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between'
  },
  textField: {
    width: 200,
  },
  dense: {
    marginTop: 19,
  },
  menu: {
    width: 'auto',
  },
  paper: {
      padding: theme.spacing(2),
      textAlign: 'center',
      color: theme.palette.text.secondary,
      marginTop: '10px',
  },
});


class KRA extends Component {

    constructor(){
        super();
        this.state = {
            teammate:{},
            isLoading:false,
            userid:"",
            month:"",
            year:"",
            isDirty:false,
            saving:false,
            canEdit:false
        };
    }
    
    handleChange = name => event => {
        let KRA = this.state.KRA;
        KRA[name] = event.target.value;
        this.setState({ KRA: KRA });
        this.markForSave();
    };
    handleCheckChange = name => event => {
        let KRA = this.state.KRA;
        KRA[name] = event.target.checked;
        this.setState({ KRA: KRA });
        this.markForSave();
    };

    componentDidMount() {
        this.setState({isLoading:true});

        let {teammate_id} = this.props;
        if(! teammate_id ) {
            teammate_id = Config.my_teammate_id;
        }
        this.setState({isLoading:true, teammate_id:teammate_id});
        let params = "teammate_id=" + teammate_id;
        
 
        fetch(Config.baseURL + '/wp-json/rhythmus/v1/kra?'+params+'&'+Config.authKey,{
            method: "GET",
            cache: "no-cache"
        })
            .then(response => {
                if (response.ok) {
                  return response.json();
                } else {
                  throw new Error('Something went wrong ...');
                }
            })
            .then(data => {
                let kra = data;
                const canEdit = Config.is_admin || kra.teammate_id === Config.my_teammate_id;
                this.setState({kra:kra, isLoading:false, canEdit:canEdit });
            }
        ).catch(error => this.setState({error, isLoading:false}));
    }


    onSaving = (saving) => {
        this.setState({saving:saving});
    }
    onEditKRA = () => {
      this.setState({isEditing:true});
    }
    onViewKRA = () => {
      this.setState({isEditing:false});
    }

    closeTeammate = () => {
        this.props.onCloseKRA();
    }

    render() {
        const{ isLoading, error, canEdit, kra} = this.state;

        const { classes } = this.props;

        let body = "";

        if(error)
        {
            return <p>{error.message}</p>
        }
        if(isLoading)
        {
            return <CircularProgress />;
        }

        let closeBtn = "";
        if(this.props.onCloseKRA) {
            closeBtn = <Button variant="outlined" className={classes.closeBtn} onClick={this.closeTeammate} disabled={this.state.saving} title="Close"><IconClose/></Button>;
        }

        let viewBtn = <Button onClick={this.onViewKRA} disabled={this.state.saving}><IconBack/> Back</Button>;
        if( ! this.state.isEditing ){
            viewBtn = "";
            body = <KRAViewer kra={kra} classes={classes}></KRAViewer>;
        }

        let editBtn = "";
        if(this.state.isEditing){
            body = <KRAEditor kra={kra} onSaving={this.onSaving}></KRAEditor>;
        }
        else if(canEdit) {
            editBtn = <Button className={classes.prevBtn} onClick={this.onEditKRA} disabled={this.state.saving}><IconEdit/> Edit</Button>;
        }

        const name = kra && kra.name;

        return(
            <div>
                <Grid container>
                    <Grid item xs={6}>
                        <ButtonGroup size="small" aria-label="small button group">
                            {viewBtn}
                            {editBtn}
                            {closeBtn}
                        </ButtonGroup>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <Paper className={classes.paper}>
                                <h2>{name}</h2>
                                {body}
                    </Paper>
                </Grid>
            </div>
        )
    }
    
}

KRA.propTypes = {
  classes: PropTypes.object.isRequired
  };
  
  export default withStyles(styles)(KRA);