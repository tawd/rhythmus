import React, {Component} from 'react';
// eslint-disable-next-line
import TeamListRow from '../TeamKRABrowser/TeamListRow';
import '../../Rhythmus.css';
// eslint-disable-next-line
//import Config from '../../config.js';
// eslint-disable-next-line
var kra = '../../../../includes/Endpoint/sample-data/kra.json';

class KRAViewer extends Component {

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
            opent:false
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


    //functions to get data for the KRA
   //getSampledata is used for testing while 
    getSampleData() {
        //endpoint TBD
        response.send({
            "app":"Rhythmus",
            "version":1,
            "name":"Aaron Griffy",
            "userid":"345",
            "is_current":"true",
            "revision_number":"5",
            "create-date":"2019-01-01 12:34",
            "last-update":"2019-02-12 16:34",
            "position":"CTO and Lead Developer",
            "kra":
                [
                    {
                        "title":"Tech Lead",
                        "description":""
                    },
                    {
                        "title":"Tech Lead",
                        "description":""
                    },
                    {
                        "title":"Tech Lead",
                        "description":""
                    }   
                ]
        });


    } 
  
    //getData() {}



    componentDidMount() {
        this.setState({isLoading:true});

        const{userid} = this.props;
        this.setState({isLoading:true, userid:userid});
        // eslint-disable-next-line
        let params = "teammate_id="+userid;
// eslint-disable-next-line
        let year = 2019;
        
/*maping for kra*/ 
 
// let teammateRowss = teammates.map((teammate) => {
//             return (<TeamListRow key={teammate.userid} onChooseTeammateMonth={this.onChooseTeammateMonth} 
//                              onChooseTeammateKRA={this.onChooseTeammateKRA} 
//                              teammate={teammate} year={currYear} month={currMonth} numCols={numCols}/>);
//         });
        
       

        /* THIS will load the file once endpoint and back end is set up.*/ 
        // fetch(Config.baseURL + '/wp-json/rhythmus/v1/kra?'+params+'&'+Config.authKey,{
        //     method: "GET",
        //     cache: "no-cache"
        // })
        //     .then(response => {
        //         if (response.ok) {
        //           return response.json();
        //         } else {
        //           throw new Error('Something went wrong ...');
        //         }
        //     })
        //     .then(data => {
        //         let kra = data;
        //         this.setState({kra:kra,isLoading:false});
        //     }
        // ).catch(error => this.setState({error, isLoading:false}));
    }

    loadKRA= () => {
        const{year, userid, month} = this.props;
        this.setState({isLoading:true, month:month, year:year});
        let params = "teammate_id="+userid;
        // fetch(Config.baseURL + '/wp-json/rhythmus/v1/kra?'+params+'&'+Config.authKey,{
        //     method: "GET",
        //     cache: "no-cache"
        // })
        //     .then(response => {
        //         if (response.ok) {
        //           return response.json();
        //         } else {
        //           throw new Error('Something went wrong ...');
        //         }
        //     })
        //     .then(data => {
        //         let teammate = data;
        //         this.setState({teammate:teammate});
        //         if(teammate && teammate.months) {
        //             let KRA = teammate.months[year+"-"+month];
        //             if(!KRA){
        //                 KRA = {};
        //             }
        //             this.setState({KRA:KRA});
        //         }
        //         this.setState({teammate:data,isLoading:false});
        //     }
        // ).catch(error => this.setState({error, isLoading:false}));
    
    }

    render() {
        // eslint-disable-next-line
        const{isLoading, error, userid} = this.state;
        if(error)
        {
            return <p>{error.message}</p>
        }
        if(isLoading)
        {
            return <p>Loading...</p>;
        }
        // if(viewTeammate){
        //     return(
        //         <div>
        //             <button onClick={this.onCloseKRA}>Close</button>
        //         </div>
        //     )
        // }

        return(
            <div>
            </div>
        )
    }
    
}

export default KRAViewer;