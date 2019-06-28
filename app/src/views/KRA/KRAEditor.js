import React, {Component} from 'react';
//import TeammateKRAReview from './TeammateKRAReview';
//import TeamListRow from './TeamListRow';
//import  './kra.json' 
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
let KRAjson='kra.json';

class KRAEditor extends Component {

    constructor(){
        super();
        this.state = {
            isLoading:false,
            teammates:false,
            kraLoaded:false,
            data:null,
            kra:[],
        };
    }
    
     


    onAreaChange = () => {
       let input = this.state.kra;
       if(!input.kra){
         input.kra = {};
       }
       
    }
    // loadSampleKRA = () => ({
    //   return :'kra.json'
    //   //this.setState({kraLoaded:true})
    // }.then( data => {
    //   this.setState({kraLoaded:true, isLoading:false});
    //   Config.kraTopics = data.kra;
    // }).catch(error => this.setState({error, isLoading:false})));

    componentDidMount() {
        this.setState({isLoading:true});
    //  const test = () => {return KRAjson}.then( data => {
    //   // this.setState({kraLoaded:true, isLoading:false});
    //   Config.kraTopics = data.kra;
    // }).catch(error => this.setState({error, isLoading:false}));

        const{userid} = this.props;
        this.setState({isLoading:true, userid:userid});
        let params = "teammate_id="+userid;  

        let year = 2019;

        // if(!kraLoaded){
        //   this.loadSampleKRA();
        // }
        let s = "";
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

              data.forEach(element => {
                s = element;
                console.log("DATA ELEMENT")
                console.log(s);
               // Config.kraTopics = element.kra;
                return s;
                
              });


             // console.log(s)
              
              //Config.kraTopics = s.kra;
                //let kraDATA = s;

                
                this.setState({kra:s,isLoading:false});
            }
        ).catch(error => this.setState({error, isLoading:false}));
        this.setState({isLoading:false});
    
    }

    render() {
        const{isLoading, error, kraLoaded, kra, viewTeammate, userid} = this.state;
        const {classes, review} = this.props;
        const closeBtn = <Button variant="outlined" onClick={this.props.onCloseKRA}>Close</Button>;
        let topicJSX = [];
        if(error)
        {
            return <p>{error.message}<br/>{closeBtn}</p>
        }
        // if(kraLoaded)

        //justin is trying to understand how json works here and what's the best way to use it.
          console.log("next line is KRA Data")
        //console.log(this.state.kra[4]);
          let jsonData = kra;
          let dataSTRING = JSON.stringify(jsonData);
          console.log(dataSTRING);
          let dataJSON = JSON.parse(dataSTRING);
          console.log("this is a json object");
          console.log(this.state.kra.kra);
          
            topicJSX.push(<KRAarea key={this.state.kra.teammate_id} 
              kra={this.state.kra}
              position={this.state.kra.position}
              iscurrent={this.state.kra.is_current}
              date={this.state.kra.create_date}
            />);
        
          
          //console.log(dataJSON[date_created]);
          //let kraCreateDate = dataJSON.create_date;
          //   kraDATA.forEach(function(topic){
          //   topicJSX.push(<KRAarea 
            
          //     />)
          // });
         
          return(<div className="kra">
          
          <Grid container spacing={24}>
                          <Grid item xs={12}>{closeBtn}</Grid>             
                          
                       
                           
                          {/* {this.state.kra.map((singleKRA) => 
                           <div key={singleKRA.userid}>
                              <p>
                                {singleKRA.position}
                              </p>
                           </div>
                          )} */}
                          {topicJSX}
                          </Grid> 
        </div>)
        //   }
        // if(isLoading)
        // {
        //     return <CircularProgress />;
        // }
        //if(viewTeammate){
              // return(
              //     <div>
              //         <button onClick={this.onCloseKRA}>Close</button>
              //         <Grid>
              //             <h1>test</h1>
              //            <KRAarea/>
              //             </Grid> 
              //     </div>)
      //}
//       if(kra){
//         return(
//             <div>
//                 <button onClick={this.onCloseKRA}>Close</button>
//                 <Grid>
//                     <h1>test</h1>
//                    <KRAarea/>
//                     </Grid> 
//             </div>)
// }

    }
  }


export default KRAEditor;