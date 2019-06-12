import React, {Component} from 'react';
//import TeammateKRAReview from './TeammateKRAReview';
//import TeamListRow from './TeamListRow';
//import  './kra.json' 
import '../../Rhythmus.css';
import './KRAarea';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Snackbar from '@material-ui/core/Snackbar';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
//import Config from '../../config.js';

//import { RIEToggle, RIEInput, RIETextArea, RIENumber, RIETags, RIESelect } from 'riek';
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

//   let test = {
//     "app":"Rhythmus",
//     "version":1,
//     "name":"Aaron Griffy",
//     "userid":"34  5",
//     "is_current":"true",
//     "revision_number":"5",
//     "create-date":"2019-01-01 12:34",
//     "last-update":"2019-02-12 16:34",
//     "position":"CTO and Lead Developer",
//     "kra":
//         [
//             {
//                 "title":"Tech Lead",
//                 "description":""
//             },
//             {
//                 "title":"Tech Lead",
//                 "description":""
//             },
//             {
//                 "title":"Tech Lead",
//                 "description":""
//             }   
//         ]
// };


class KRAEditor extends Component {

    constructor(){
        super();
        this.state = {
            isLoading:false,
            teammates:false,
            data:null
        };
    }
    
      

    // loadSampleKRA = () => ({
    //   return :'kra.json'
    // }.then( data => {
    //   let kraLoaded = data;
    //   this.setState({kra:kra});
    // }).catch(error => this.setState({error, isLoading:false})));

    componentDidMount() {
        this.setState({isLoading:true});

        const{userid} = this.props;
        this.setState({isLoading:true, userid:userid});
        let params = "teammate_id="+userid;  

        let year = 2019;

        // if(!kraLoaded){
        //   this.loadSampleKRA();
        // }
        fetch('http://justintest1.wpengine.com/wp-content/kra.json',{
            method: "GET",
            cache: "no-cache",
            mode:"no-cors",
            
        })
            .then(response => {
              console.log(response)
                if (response.ok) {
                  return response.json();
                } else {
                  throw new Error('Something went wrong ...');
                 }
            })  
            .then(data => {
                let kra = data;
                this.setState({kra:kra,isLoading:false});
            }
        ).catch(error => this.setState({error, isLoading:false}));
        this.setState({isLoading:false});
    }

    render() {
        const{isLoading, error, kra, userid} = this.state;
        const {classes, review} = this.props;
        const closeBtn = <Button variant="outlined" onClick={this.props.onCloseKRA}>Close</Button>;
        let topicJSX = [];
        if(error)
        {
            return <p>{error.message}<br/>{closeBtn}</p>
        }
        if(isLoading)
        {
            return <CircularProgress />;
        }
        // if(viewTeammate){
        //     return(
        //         <div>
        //             <button onClick={this.onCloseKRA}>Close</button>
        //         </div>
        //     )
        // }
        // Config.kra.forEach(function(KRAarea){

        //     topicJSX.push(<KRAarea key={kra.title}  
                
        //         description={kra.description}
                
        //         />)
        // });



        return(
            
            <div className="kra">
        <header></header>
        <Grid container spacing={24}>
                        <Grid item xs={12}>{closeBtn}</Grid>             
                        <Grid item xs={12}>
                           
                        </Grid>
                       <KRAarea/>
                        </Grid>

        

        
      </div>
        )
        }
        // else{
        //     return(
        //         <div>And error has occured.</div>
        //     )
        // }
    
}


export default KRAEditor;