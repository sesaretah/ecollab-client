import React from 'react';
import ReactDOM from 'react-dom';
//import './css/demo.min.css';
//import './css/tabler.min.css';
//import './css/demo.rtl.min.css';
//import './css/tabler.rtl.min.css';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import "react-datepicker/dist/react-datepicker.css";
import 'react-bootstrap-range-slider/dist/react-bootstrap-range-slider.css';
import './css/quill.snow.css';
//import './css/app.css';
import './css/dish.css';

import App from './App';
import reportWebVitals from './reportWebVitals';

const RtlTheme = React.lazy(() => import('./components/common/rtl'));
const LtrTheme = React.lazy(() => import('./components/common/ltr'));

//STEP 2:
//create a parent component that will load the components conditionally using React.Suspense
const ThemeSelector = ({ children }) => {
  const CHOSEN_THEME = window.localStorage.getItem('dir') || 'rtl';
  return (
    <>
      <React.Suspense fallback={<></>}>
        {(CHOSEN_THEME === 'rtl') && <RtlTheme />}
        {(CHOSEN_THEME === 'ltr') && <LtrTheme />}
      </React.Suspense>
      {children}
    </>
  )
}

ReactDOM.render(
  <ThemeSelector>
    <App />
  </ThemeSelector>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
