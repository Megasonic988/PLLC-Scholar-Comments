import React, { Component } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import * as firebase from 'firebase';
import TeachingFellowPage from './pages/TeachingFellowPage';
import LeadInstructorPage from './pages/LeadInstructorPage';
import StudentPage from './pages/StudentPage';
import HomePage from './pages/HomePage';
import NotFoundPage from './pages/NotFoundPage';
import NavBar from './components/NavBar';

const Main = (props) => {
  const user = props.user;
  if (user) {
    return (
      <Switch>
        <Route exact path='/' render={(p) => (
          <HomePage {...p} user={user} authLoaded={props.authLoaded} />
        )} />
        <Route path='/lead' component={LeadInstructorPage} />
        <Route path='/tf/:id' component={TeachingFellowPage} />
        <Route path='/student/:id' component={StudentPage} />
        <Route path='/404/' component={NotFoundPage} />
        <Redirect to='/404' />
      </Switch>
    );
  } else {
    return (
      <HomePage authLoaded={props.authLoaded} />
    );
  }
}

class App extends Component {
  constructor() {
    super();
    this.state = {
      user: null,
      authLoaded: false
    };
    this.auth = firebase.auth();
    this.auth.onAuthStateChanged(this.onAuthStateChanged.bind(this));
  }
  addUserToDatabase(userId, name, email, photoURL) {
    const newUser = {
      displayName: name,
      email: email,
      photoURL: photoURL,
      uid: userId,
      role: 'tf'
    };
    firebase.database().ref('users/' + userId).set(newUser);
    return newUser;
  }
  onAuthStateChanged(user) {
    console.log('Auth State Changed', user);
    this.setState({
      authLoaded: true
    })
    if (user) {
      firebase.database().ref('users/' + user.uid).once('value')
        .then(userFromDb => {
          if (userFromDb.val()) {
            this.setState({ user: userFromDb.val() });
          } else {
            const newUser = this.addUserToDatabase(user.uid, user.displayName, user.email, user.photoURL);
            this.setState({ user: newUser });
          }
        });
    } else {
      this.setState({
        user: null
      });
    }
  }
  render() {
    return (
      <div>
        <Route render={(props) => (
          <NavBar {...props} user={this.state.user} auth={this.auth} />
        )} />
        <Main user={this.state.user} authLoaded={this.state.authLoaded} />
      </div>
    );
  }
}

export default App;
