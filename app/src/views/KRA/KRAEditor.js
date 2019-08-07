import React, {Component} from 'react';
<<<<<<< HEAD
// import TeammateKRAReview from './TeammateKRAReview';
import TeamListRow from '../TeamKRABrowser/TeamListRow';
=======
//import TeammateKRAReview from './TeammateKRAReview';
//import TeamListRow from './TeamListRow';
//import  './kra.json' 
>>>>>>> 7ba007e6f3588960dbb32bff39a8366781fd1f3e
import '../../Rhythmus.css';
import './KRAarea';
import PropTypes, { func } from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Snackbar from '@material-ui/core/Snackbar';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Config from '../../config.js';

<<<<<<< HEAD
// import { RIEToggle, RIEInput, RIETextArea, RIENumber, RIETags, RIESelect } from 'riek';
=======

//import { RIEToggle, RIEInput, RIETextArea, RIENumber, RIETags, RIESelect } from 'riek';
>>>>>>> 7ba007e6f3588960dbb32bff39a8366781fd1f3e
import _ from 'lodash';
import KRAarea from './KRAarea';

const styles = theme => ({
    container: {
      display: 'flex',
      flexWrap: 'wrap',
    },
    textField: {
      marginLeft: theme.spacing.unit,
      marginRight: theme.spacing.unit,
      width: 200,
    },
    dense: {
      marginTop: 19,
    },
    menu: {
      width: 200,
    },
    paper: {
        padding: theme.spacing.unit * 2,
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },
  });


class KRAEditor extends Component {
  constructor(){
      super();
      this.state = {
          isLoading:true,
          teammates:false,
          kraLoaded:false,
          data:null,
          open:false,
          kraData:[],

      };
  };


  onKRADataChange = (topicKey, key, val) => {
    console.log("onKRADataChange:"+topicKey+"|"+key+"|"+val);
      let data = this.state.kraData;
      if(!data.kra){
        data.kra = {};
      }
      let descriptions = data.kra[topicKey];
      if(!descriptions){
        descriptions = {};
      }
      descriptions[key] = val;
      data.kra[topicKey] = descriptions;
      this.setState({kraData: data })

      //if(userCanEDIT){markForSave();}
  }

  markForSave = () => {
    if(this.state.open){
      this.state({open:true});
    }
  };

<<<<<<< HEAD
    render() {
        // const{isLoading, error, userid} = this.state;
        // if(error)
        // {
        //     return <p>{error.message}</p>
        // }
        // if(isLoading)
        // {
        //     return <p>Loading...</p>;
        // }
        // if(this.viewTeammate){
        //     return(
        //         <div>
        //             <button onClick={this.onCloseKRA}>Close</button>
        //         </div>
        //     )
        // }

        return(
            <div>
                <p>test</p>
            </div>
        )
=======
  saveKRA = () => {
    let KRA = this.state.kraData;
    KRA.userid = this.props.userid;
    console.log("Saving...")
    this.setState({open:false});
    //STILL WAITNING FOR ENDPOINT TO FINISH
    // fetch(Config.baseURL+ 'WAITING FOR ENDPOINT',{
    //   method:"POST",
    //   cache:"no-cache",
    //   "body": JSON.stringify(KRA)
    // }).then(response => {
    //   if(response.ok){
    //     return response.json();
    //   }else{
    //     throw new Error('Something went wrong...');
    //   }
    // }).then(data => {
    //   console.log(data);
    //   if(!data.success){
    //     throw new Error('Errir saving ot server ...');
    //   }
    // }).catch(error => this.setState({error}));
  };
  componentDidMount() {
    this.setState({isLoading:true});
    const{userid} = this.props;
    this.setState({isLoading:true, userid:userid});
    let params = "teammate_id="+userid;  
    let year = 2019;
     // if(!Config.kraData){
      fetch('http://rhythmus.dev.cc/wp-json/rhythmus/v1/kra/?id=17',{
          method: "GET",
          cache: "no-cache",    
      })
      .then(response => {
      // console.log(response.json())
          if (response.ok) {
            return response.json();
          } else {
            throw new Error('Something went wrong ...');
          }
      })  
      .then(data => {
        //const dataMap = data.map(function(dataIn) {return dataIn});
        let DataReturn = [];
        Config.kraData = data.kra;                  
        this.setState({kraData:data,isLoading:false});
      }
      ).catch(error => this.setState({error, isLoading:false}));
    // }
  }

  render() {
    const{isLoading, error, kraLoaded, kraData, viewTeammate, userid} = this.state;
    const {classes, review} = this.props;
    const closeBtn = <Button variant="outlined" onClick={this.props.onCloseKRA}>Close</Button>;
    const saveBtn = <Button variant="outlined" onClick={this.saveKRA}>Save</Button>;
    let topicJSX = [];
    let onKRADataChangeFunction = this.onKRADataChange;
    if(error)
    {
        return <p>{error.message}<br/>{closeBtn}</p>
>>>>>>> 7ba007e6f3588960dbb32bff39a8366781fd1f3e
    }
    if(isLoading){
      return <CircularProgress/>
    }
    // if(kraLoaded)
    //justin is trying to understand how json works here and what's the best way to use it.
    console.log("next line is KRA Data")
    let dataSTRING = JSON.stringify(kraData);
    console.log(dataSTRING);
    let dataJSON = JSON.parse(dataSTRING);
    console.log("this is a json object");
    console.log(this.state.kraData);
    console.log("this is the kra");
    console.log(this.state.kraData.kra);

    let i = 0;
    this.state.kraData.kra.forEach(element => {
      topicJSX.push(<KRAarea key={i} 
        index={i}
        title={element.title}
        description={element.description}
        position={element.position}
        iscurrent={element.is_current}
        onKRADataChange={onKRADataChangeFunction}
        date={element.create_date}
      />);       
      i++;
    })
      
    
    return(<div className="kra">
    
    <Grid container spacing={24}>
                    <Grid item xs={12}>{closeBtn}</Grid>                                 
                    {topicJSX}
                      </Grid> 
                      <br/>
                      <Grid item xs={12}>{saveBtn}</Grid>                                 

    </div>)
  }
}

export default KRAEditor;