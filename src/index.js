import React from 'react';
import ReactDOM from 'react-dom';
import 'semantic-ui-css/semantic.min.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import * as firebase from 'firebase';
import { BrowserRouter } from 'react-router-dom';

var config = {
  apiKey: "AIzaSyBXnZ3h9ili_spgZtNms1Ig4hF-KWcFx6Q",
  authDomain: "pllc-scholar-comments.firebaseapp.com",
  databaseURL: "https://pllc-scholar-comments.firebaseio.com",
  projectId: "pllc-scholar-comments",
  storageBucket: "pllc-scholar-comments.appspot.com",
  messagingSenderId: "695592140683"
};
firebase.initializeApp(config);

ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById('root'));
registerServiceWorker();
