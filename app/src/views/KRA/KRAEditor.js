import React, {Component} from 'react';
import '../../Rhythmus.css';
import KRAAreaEditor from './KRAAreaEditor';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core/styles';
import Config from '../../config.js';

const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  dense: {
    marginTop: 19,
  },
  textField: {
    width: '60%',      
  },
  menu: {
    width: 200,
  }
});

class KRAEditor extends Component {
  autoSaveTimer = false;

  constructor(){
    super();
    this.state = {
        kra:false,
        isDirty:false,
        open:false
    };
  }

  markForSave = () => {
    if(!this.state.isDirty) {
        this.setState( { isDirty:true } );
        this.props.onSaving(true);
    }
    if(!this.autoSaveTimer) {
        this.autoSaveTimer = setTimeout(this.handleAutoSave, 1000);
    }
  }

  handleAutoSave = () => {
      this.autoSaveTimer = false;
      this.saveKRA();
  }

  saveKRA = () => {
      let kra = this.state.kra;
      fetch(Config.baseURL + '/wp-json/rhythmus/v1/kra?'+Config.authKey,{
          method: "POST",
          cache: "no-cache",
          body: JSON.stringify(kra)
      })
          .then(response => {
              if (response.ok) {
                  return response.json();
              } else {
                  throw new Error('Something went wrong ...');
              }
          })
          .then(data => {
              if( !data.success ) {
                  throw new Error('Error saving to server ...');
              }
              this.props.onSaving(false);
          }
      ).catch(error => this.setState({error}));

  }

  
  componentDidMount() {
    let kra = this.props.kra;
    this.setState({kra:kra});
    
  }

  onKRADataChange = (index, name, value) =>
  {
    let kra = this.state.kra;
    let areaList = kra.kra;
    let area = areaList[index];
    if(!area){
      areaList[index] = {};
      area = areaList[index];
    }
    area[name] = value;
    this.setState({ kra: kra });
    this.markForSave();
  }
  handleChange = name => event => {
    let kra = this.state.kra;
    kra[name] = event.target.value;
    this.setState({ kra: kra });
    this.markForSave();
  };

  render() {
    const { classes } = this.props;
    const { kra } = this.state;

    if( !kra || !kra.kra) {
      return "Need KRA...";
    }
    let areas = [];
    let i = 0;
    for( i = 0; i < 3; i++ ){
      let area = kra.kra[i];
      if(!area) {
        area = {};
        kra[i] = area;
      }
      areas.push(<KRAAreaEditor key={i}
        index={i}
        area={area}
        title={area.title}
        description={area.description}
        onKRADataChange={this.onKRADataChange}
        />);
    }
    return( 
        <Grid container>
          <Grid item xs={12}>
            <TextField
                id="position"
                value={kra.position}
                label={"Position"}
                className={classes.textField}
                onChange={this.handleChange('position')}
              />
            </Grid>
          <Grid item xs={12}>
            {areas}
          </Grid>
        </Grid>)
  }
}

export default withStyles(styles)(KRAEditor);