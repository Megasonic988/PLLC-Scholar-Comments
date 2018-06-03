import React, { Component } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { Dimmer, Loader } from 'semantic-ui-react';
import * as firebase from 'firebase';
import './App.css';

import UnauthorizedUserPage from './pages/UnauthorizedUserPage';
import NoPermissionsPage from './pages/NoPermissionsPage';
import NotFoundPage from './pages/NotFoundPage';
import WelcomePage from './pages/WelcomePage';
import ForumPage from './pages/ForumPage';
import DashboardPage from './pages/DashboardPage';
import StudentPage from './pages/StudentPage';
import CommentPage from './pages/CommentPage';
import AllStudentsPage from './pages/AllStudentsPage';
import NavBar from './components/NavBar';

class App extends Component {
  constructor() {
    super();
    this.state = {
      user: null,
      authLoaded: false
    };
    this.auth = firebase.auth();
  }

  componentDidMount() {
    this.auth.onAuthStateChanged(this.onAuthStateChanged.bind(this));
  }

  routeWithUserProps(path, Component) {
    return (
      <Route exact path={path} render={(props) => (
        <Component {...props} user={this.state.user} />
      )} />
    );
  }

  pages() {
    return (
      <Switch>
        {this.routeWithUserProps('/', DashboardPage)}
        {this.routeWithUserProps('/forums/:id', ForumPage)}
        {this.routeWithUserProps('/students', AllStudentsPage)}
        {this.routeWithUserProps('/students/:id', StudentPage)}
        {this.routeWithUserProps('/comments/:id', CommentPage)}
        {this.routeWithUserProps('/permissions', NoPermissionsPage)}
        {this.routeWithUserProps('/404', NotFoundPage)}
        <Redirect to='/404' />
      </Switch>
    );
  }

  onAuthStateChanged(user) {
    console.log(user);
    console.log('ere')

    // if successfully logged in via Google, get the user object from the database
    if (user) {
      firebase
        .database()
        .ref(`users/${user.uid}`)
        .once('value')
        .then(snapshot => {
          if (snapshot.val()) {
            // set user as Google info + database info
            this.setState({ user: Object.assign(snapshot.val(), user) });
            firebase
              .database()
              .ref(`users/${user.uid}`)
              .update({
                displayName: user.displayName,
                photoURL: user.photoURL
              });
          } else {
            this.setState({
              user: user
            });
            firebase
              .database()
              .ref(`users/${user.uid}/displayName`)
              .set(user.displayName);
            firebase
              .database()
              .ref(`users/${user.uid}/photoURL`)
              .set(user.photoURL);
            firebase
              .database()
              .ref(`users/${user.uid}/email`)
              .set(user.email);
          }
          this.setState({ authLoaded: true })
        });
    }

    // user is not signed in
    else {
      this.setState({
        user: null,
        authLoaded: true
      });
    }
  }

  render() {
    return (
      <div>
        {!this.state.authLoaded &&
          <Dimmer active>
            <Loader />
          </Dimmer>
        }
        <NavBar user={this.state.user} />
        {this.state.authLoaded && this.state.user && !this.state.user.role &&
          <UnauthorizedUserPage />
        }
        {this.state.authLoaded && !this.state.user &&
          <WelcomePage />
        }
        {this.state.user && this.state.user.role &&
          this.pages()
        }
      </div>
    );
  }
}

export default App;
