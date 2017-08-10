import React, { Component } from 'react';
import { Dimmer, Loader, Grid, Segment, Label } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import * as firebase from 'firebase';
import * as FirebaseHelper from '../FirebaseHelper';
import moment from 'moment';

import ForumList from '../components/ForumList';
import StudentList from '../components/StudentList';
import ForumForm from '../components/ForumForm';
import CommentsSummaryList from '../components/CommentsSummaryList';

class DashboardPage extends Component {
  constructor() {
    super();
    this.state = {
      forums: [],
      warningStudents: [],
      comments: [],
      loading: true
    };
  }

  componentWillMount() {
    this.getForumsFromFirebase();
    this.getWarningStudentsFromFirebase();
    this.getRecentCommentsFromFirebase();
  }

  componentWillUnmount() {
    firebase.database().ref('students').off();
    firebase.database().ref('forums').off();
    firebase.database().ref('comments').off();
  }

  getForumsFromFirebase() {
    firebase
      .database()
      .ref('forums')
      .on('value', snapshot => {
        this.setState({
          forums: FirebaseHelper.snapshotToArray(snapshot) || [],
          loading: false
        });
      });
  }

  getWarningStudentsFromFirebase() {
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

  getForumsInYear(year) {
    const forumsInYear = this.state.forums.filter(f => f.year === String(year))
    const forumsInYearSortedByLetter = forumsInYear.sort((f1, f2) => {
      if (f1.letter < f2.letter) return -1;
      else if (f1.letter > f2.letter) return 1;
      else return 0;
    });
    return forumsInYearSortedByLetter;
  }

  getRecentCommentsFromFirebase() {
    firebase
      .database()
      .ref('comments')
      .orderByChild('dateUpdated')
      .startAt(moment().subtract(3, 'd').toISOString())
      .on('value', snapshot => {
        this.setState({
          comments: FirebaseHelper.snapshotToArray(snapshot) || []
        });
      });
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

  handleChange(text, medium) {
    this.setState({ text: text });
    console.log(text, medium)
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
            <Grid centered style={{ paddingBottom: '30px' }}>
              <ForumForm createdBy={this.props.user.uid} />
            </Grid>
          }
          <Grid>
            <Grid.Row>
              <Grid.Column width={6}>
                <Segment>
                  <Label as='a' color='green' size='large' ribbon>
                    First Year Forums
                  </Label>
                  <ForumList forums={this.getForumsInYear(1)} />
                </Segment>
                <Segment>
                  <Label as='a' color='green' size='large' ribbon>Second Year Forums</Label>
                  <ForumList forums={this.getForumsInYear(2)} />
                </Segment>
                <Segment>
                  <Label as='a' color='red' size='large' ribbon>Warning Students</Label>
                  <StudentList students={this.state.warningStudents} />
                </Segment>
              </Grid.Column>
              <Grid.Column width={10}>
                <Grid.Row>
                  <Segment style={{ textAlign: 'center' }}>
                    <Link to={'/students'}>View All Students</Link>
                  </Segment>
                  <Segment>
                    <Label as='a' color='orange' size='large' ribbon>
                      Recent Activity
                      <Label.Detail>{this.state.comments.length}</Label.Detail>
                    </Label>
                    <CommentsSummaryList
                      comments={this.state.comments}
                      user={this.props.user}
                    />
                  </Segment>
                </Grid.Row>
              </Grid.Column>
            </Grid.Row>
          </Grid>

        </div>
      );
    }
  }
}

export default DashboardPage;