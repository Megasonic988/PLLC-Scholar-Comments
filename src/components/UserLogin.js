import React, { Component } from 'react';
import * as firebase from 'firebase';
import { Button, Image } from 'semantic-ui-react';

class UserLogin extends Component {

  signIn() {
    const provider = new firebase.auth.GoogleAuthProvider();
    provider.setCustomParameters({
      prompt: 'select_account'
    });
    firebase.auth().signInWithPopup(provider);
  }

  signOut() {
    firebase.auth().signOut();
  }

  render() {
    if (this.props.user) {
      return (
        <div>
          <Image style={{'marginBottom': '0'}} shape='circular' size="mini" src={this.props.user.photoURL} floated="left" />
          <strong style={{'paddingRight': '10px'}}>Hello, {this.props.user.displayName.split(' ')[0]}</strong>
          <Button color="red" onClick={() => this.signOut()}>Log Out</Button>
        </div>
      );
    } else {
      return (
        <div>
          <Button primary onClick={() => this.signIn()}>Sign In</Button>
        </div>
      );
    }
    
  }
}

export default UserLogin;