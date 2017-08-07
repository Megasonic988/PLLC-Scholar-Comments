import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { Loader } from 'semantic-ui-react';

class WelcomePage extends Component {
  render() {
    return (
      <div style={{ textAlign: 'center', paddingTop: '20%' }}>
        <h1>Welcome to PLLC Scholar Comments</h1>
        <h3>Please log in to continue.</h3>
      </div>
    );
  }
}

export default WelcomePage;