import React, {Component} from 'react';
import '../../Rhythmus.css';
import Config from '../../config.js';
import KRAReviewViewer from '../KRAReview/KRAReviewViewer';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import CircularProgress from '@material-ui/core/CircularProgress';

const styles = theme => ({
    container: {
      display: 'flex',
      flexWrap: 'wrap',
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

class Dashboard extends Component {

    constructor(){
        super();
        this.state = {
            teammate:{},
            isLoading:true,
        };
    }

    componentDidMount() {
        if(!Config.kraTopics) {
            fetch(Config.baseURL + '/wp-json/rhythmus/v1/kra-topics?'+Config.authKey,{
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
                    Config.kraTopics = data.topics;
                    this.loadKRAs();
                }
            ).catch(error => this.setState({error, isLoading:false}));
        } else {
            this.loadKRAs();
        }
    }

    loadKRAs = () => {
        this.setState({isLoading:true});
        let params = "teammate_id="+Config.my_teammate_id;
        fetch(Config.baseURL + '/wp-json/rhythmus/v1/kra-review?'+params+'&'+Config.authKey,{
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
                this.setState({teammate:data,isLoading:false});
            }
        ).catch(error => this.setState({error, isLoading:false}));
    }
    render() {
        const{isLoading, error, teammate} = this.state;
        let m = Config.monthNames;

        let today = new Date();
        let year = today.getFullYear();
        let month = today.getMonth() + 1;
        let review = teammate && teammate.months && teammate.months[year+"-"+month];
        if(!review){
            review = {};
        }
    
        if(error)
        {
            return <p>{error.message}</p>
        }
        if(isLoading)
        {
            return <CircularProgress />;
        }
        
        const style = {};
    
        let prevMonth = month - 1;
        let prevYear = year;
        
        if(prevMonth < 1){
            prevYear = prevYear - 1;
            prevMonth = 12;
        }
        let prevReview = teammate && teammate.months && teammate.months[prevYear+"-"+prevMonth];
        if(!prevReview){
            prevReview = {};
        }

        const prevTotal = prevReview["total"];
        let scoreVal = parseFloat(prevTotal);
        if(scoreVal === 4 ){
            style["background"] = "rgba(82, 158, 75, 0.5)";
        }else if(scoreVal >=3 ){
            style["background"] = "rgba(131, 201, 133, 0.5)";
        }else if(scoreVal >=2 ){
            style["background"] = "rgba(223, 220, 108, 0.5)";
        }else if(scoreVal >=1 ){
            style["background"] = "rgba(223, 129, 113, 0.5)";
        }

        return (
            <div>
                <Paper>
                    <h2>My Assessment of {m[prevMonth-1]}, {prevYear}</h2>
                    <h3 style={style}>Total: {prevTotal}</h3>
                </Paper>

                <KRAReviewViewer review={prevReview} ></KRAReviewViewer>
                <Paper>
                    <h2>My Goals for {m[month-1]}, {year}</h2>
                </Paper>
                <KRAReviewViewer review={review} ></KRAReviewViewer>

            </div>
        );
    }
}

Dashboard.propTypes = {
classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Dashboard);   