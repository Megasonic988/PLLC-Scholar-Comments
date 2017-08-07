import React, { Component } from 'react';
import { Header, Divider, List, Rating, Dimmer, Loader, Grid } from 'semantic-ui-react';
import * as firebase from 'firebase';
import * as FirebaseHelper from '../FirebaseHelper';
import ForumList from '../components/ForumList';
import StudentList from '../components/StudentList';
import ForumForm from '../components/ForumForm';

class DashboardPage extends Component {
  constructor() {
    super();
    this.state = {
      forums: [],
      warningStudents: [],
      loading: true
    };

    this.getForumsFromFirebase();
    this.getWarningStudents();
  }

  getForumsFromFirebase() {
    firebase
      .database()
      .ref('forums')
      .on('value', snapshot => {
        this.setState({
          forums: FirebaseHelper.snapshotToArray(snapshot),
          loading: false
        });
      });
  }

  getWarningStudents() {
    firebase
      .database()
      .ref('students')
      .orderByChild('rating')
      .endAt(2)
      .on('value', snapshot => {
        this.setState({
          warningStudents: FirebaseHelper.snapshotToArray(snapshot) || []
        });
      });
  }

  componentWillUnmount() {
    firebase.database().ref('students').off();
    firebase.database().ref('forums').off();
  }

  getForumsInYear(year) {
    const forumsInYear = this.state.forums.filter(f => f.year === String(year))
    const forumsInYearSortedByLetter = forumsInYear.sort((f1, f2) => {
      if (f1.letter < f2.letter) return -1;
      else if (f1.letter > f2.letter) return 1;
      else return 0;
    });
    return forumsInYearSortedByLetter;
  }

  userHasCreatedForum() {
    for (let i = 0; i < this.state.forums.length; i++) {
      const forum = this.state.forums[i];
      if (forum.createdBy === this.props.user.uid) {
        return true;
      }
    }
    return false;
  }

  render() {
    if (this.state.loading) {
      return (
        <Dimmer active>
          <Loader />
        </Dimmer>
      );
    }
    else {
      return (
        <div style={{ padding: '40px' }}>
          {!this.userHasCreatedForum() &&
            <Grid centered>
              <ForumForm createdBy={this.props.user.uid} />
            </Grid>
          }
          <Header as='h1'>First Year Forums</Header>
          <Divider />
          <ForumList forums={this.getForumsInYear(1)} />
          <Header as='h1'>Second Year Forums</Header>
          <Divider />
          <ForumList forums={this.getForumsInYear(2)} />
          <Header as='h1'>Warning Students</Header>
          <Divider />
          <StudentList students={this.state.warningStudents} />
        </div>
      );
    }
  }
}

export default DashboardPage;