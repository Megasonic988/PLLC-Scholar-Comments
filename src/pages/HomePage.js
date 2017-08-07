import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { Loader } from 'semantic-ui-react';

class HomePage extends Component {
  render() {
    if (!this.props.authLoaded) {
      return (
        <div style={{ paddingTop: '30px' }}>
          <Loader size='massive' inline='centered' active>
            Loading
        </Loader>
        </div>
      );
    }
    if (this.props.user) {
      if (this.props.user.role === 'lead') {
        return (
          <Redirect to='/lead' />
        );
      } else if (this.props.user.role === 'tf') {
        return (
          <Redirect to={'/tf/' + this.props.user.uid} />
        );
      } else {
        return (
          <div>
            <h1>
              Thank you for signing in! Please wait while
              you are assigned permissions to the application.
            </h1>
          </div>
        );
      }
    }
    return (
      <div style={{ textAlign: 'center', paddingTop: '20%' }}>
        <h1>Welcome to PLLC Scholar Comments</h1>
        <h3>Please log in to continue.</h3>
      </div>
    );
  }
}

export default HomePage;