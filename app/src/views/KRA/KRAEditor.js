import React, {Component} from 'react';
import TeammateKRAReview from './TeammateKRAReview';
import TeamListRow from './TeamListRow';
import '../../Rhythmus.css';
import Config from '../../config.js';

import { RIEToggle, RIEInput, RIETextArea, RIENumber, RIETags, RIESelect } from 'riek';
import _ from 'lodash';


class KRAReviewEditor extends Component {

    constructor(){
        super();
        this.state = {
            isLoading:false,
            teammates:false
        };
    }
    
    onChooseTeammateKRA = (userid) => {
        //TODO: Implement what happens to view a teammate's KRA when their name is clicked from the list
    }

    componentDidMount() {
        this.setState({isLoading:true});

        let year = 2019;
        fetch(Config.baseURL + '/wp-json/rhythmus/v1/teammate-list?year='+year+'&'+Config.authKey,{
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
                let teammates = data.teammates.map((teammate) => {
                    return (<TeamListRow key={teammate.userid} onChooseTeammateMonth={this.onChooseTeammateMonth} 
                                     onChooseTeammateKRA={this.onChooseTeammateKRA} 
                                     teammate={teammate} year={year}/>);
                })
            this.setState({teammates:teammates,isLoading:false});
            }
        ).catch(error => this.setState({error, isLoading:false}));
    }

    render() {
        const{isLoading, error, viewTeammate, userid, month, year} = this.state;
        if(error)
        {
            return <p>{error.message}</p>
        }
        if(isLoading)
        {
            return <p>Loading...</p>;
        }
        if(viewTeammate){
            return(
                <div>
                    <button onClick={this.onCloseTeammate}>Close</button>
                    <TeammateKRAReview userid={userid} month={month} year={year} />
                </div>
            )
        }

        return(
            <div>
                <RIEInput
                    value={this.state.text}
                    propName='title'
                    beforeStart={this.onStartEditing}
                    afterFinish={this.onFinishEditing}
                    validate={_.isString} />
                <RIETextArea
                    value={this.state.textarea}
                    propName="textarea"
                     />

            </div>
        )
    }
}


export default KRAReviewEditor;