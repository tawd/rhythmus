import React, {Component} from 'react';
import '../../Rhythmus.css';
import KRAAreaViewer from './KRAAreaViewer';
import Grid from '@material-ui/core/Grid';

const viewerStyle = {
    textAlign: "left",
    marginLeft: "20%",
    marginRight: "20%"
};

class KRAViewer extends Component {

    componentDidMount() {
        
    }

    render() {
        const { kra } = this.props;
    
        if( !kra || !kra.kra) {
          return "Need KRA...";
        }
        let areas = [];
        for( let i = 0; i < 3; i++ ){
          let area = kra.kra[i];
          if(!area) {
            area = {};
            kra[i] = area;
          }
          areas.push(<KRAAreaViewer key={i}
            index={i}
            title={area.title}
            description={area.description}
            />);
        }
        return( 
          <div className="kra" >
    
            <Grid container>
              <Grid item xs={12}>
                <h3>{kra.position}</h3>
                </Grid>
              <Grid item xs={12} style={viewerStyle}>
                {areas}
              </Grid>
            </Grid>
        </div>)
      
    }
}

export default KRAViewer;