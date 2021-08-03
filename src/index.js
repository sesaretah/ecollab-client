import React from 'react';
import ReactDOM from 'react-dom';
//import './css/demo.min.css';
//import './css/tabler.min.css';
import './css/demo.rtl.min.css';
import './css/tabler.rtl.min.css';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import "react-datepicker/dist/react-datepicker.css";
import 'react-bootstrap-range-slider/dist/react-bootstrap-range-slider.css';
import './css/quill.snow.css';
import './css/app.css';
import './css/dish.css';

import App from './App';
import reportWebVitals from './reportWebVitals';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
