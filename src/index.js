import React from 'react';
import ReactDOM from 'react-dom';
import 'semantic-ui-css/semantic.min.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import * as firebase from 'firebase';
import { BrowserRouter } from 'react-router-dom';

var firebaseConfig;

/* NODE_ENV is set automatically by react-scripts
yarn start: NODE_ENV = development
yarn test: NODE_ENV = test
yarn build: NODE_ENV = production
*/

if (process.env.NODE_ENV === 'development') {
  firebaseConfig = {
    apiKey: "AIzaSyAOs3A7-xbeo-lE1kTG_wOMZKxLpTJfv9A",
    authDomain: "pllc-scholar-comments-test.firebaseapp.com",
    databaseURL: "https://pllc-scholar-comments-test.firebaseio.com",
    projectId: "pllc-scholar-comments-test",
    storageBucket: "pllc-scholar-comments-test.appspot.com",
    messagingSenderId: "568652220916"
  }
}

if (process.env.NODE_ENV === 'production') {
  firebaseConfig = {
    apiKey: "AIzaSyDaFephL3mkBV4AD2mQW6XBbZ9UXoTumHE",
    authDomain: "tafta-pllc.firebaseapp.com",
    databaseURL: "https://tafta-pllc.firebaseio.com",
    projectId: "tafta-pllc",
    storageBucket: "",
    messagingSenderId: "704054740108"
  }
}

firebase.initializeApp(firebaseConfig);

ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById('root'));
registerServiceWorker();
