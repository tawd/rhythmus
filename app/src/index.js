import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Rhythmus from './Rhythmus';
import Config from './config';

Config.load();
ReactDOM.render(<Rhythmus />, document.getElementById('root'));