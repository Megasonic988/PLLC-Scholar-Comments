import React, { Component } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import * as firebase from 'firebase';
import UnauthorizedUserPage from './pages/UnauthorizedUserPage';
import NotFoundPage from './pages/NotFoundPage';
import TeachingFellowPage from './pages/TeachingFellowPage';
import DashboardPage from './pages/DashboardPage';
import StudentPage from './pages/StudentPage';
import WelcomePage from './pages/WelcomePage';
import NavBar from './components/NavBar';
import { Dimmer, Loader } from 'semantic-ui-react';

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

  onAuthStateChanged(user) {

    // if successfully logged in via Google, get the user object from the database
    if (user) {
      firebase.database().ref(`users/${user.uid}`).once('value')
        .then(snapshot => {
          if (snapshot.val()) {
            // set user as Google info + database info
            this.setState({ user: Object.assign(user, snapshot.val()) });
          } else {
            this.setState({
              user: user
            });
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

  pages() {
    return (
      <Switch>
        <Route exact path='/' component={DashboardPage} />
        <Route path='/forum/:id' component={TeachingFellowPage} />
        <Route path='/student/:id' component={StudentPage} />
        <Route path='/404' component={NotFoundPage} />
        <Redirect to='/404' />
      </Switch>
    );
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
