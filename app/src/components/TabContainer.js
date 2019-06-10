import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';

function TabContainer(props) {
    return (
      <Typography component={props.component} style={{ padding: props.padding }}>
        {props.children}
      </Typography>
    );
  }
  
  TabContainer.propTypes = {
    children: PropTypes.node.isRequired,
  };

  TabContainer.defaultProps = {
    component: 'div',
    padding: '50px',
  };

  export default TabContainer;