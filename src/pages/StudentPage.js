import React, { Component } from 'react';
import * as firebase from 'firebase';
import * as FirebaseHelper from '../FirebaseHelper';
import { Statistic, Grid, Header, Icon, Dimmer, Loader, Segment, Label } from 'semantic-ui-react';
import { Link, Redirect } from 'react-router-dom';

import AcademicCommentForm from '../components/AcademicCommentForm';
import ParticipationCommentForm from '../components/ParticipationCommentForm';
import WellnessCommentForm from '../components/WellnessCommentForm';
import InnovationCommentForm from '../components/InnovationCommentForm';

import AcademicCommentsList from '../components/AcademicCommentsList';
import ParticipationCommentsList from '../components/ParticipationCommentsList';
import WellnessCommentsList from '../components/WellnessCommentsList';
import InnovationCommentsList from '../components/InnovationCommentsList';

class StudentPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      student: null,
      forum: null,
      loading: true,
      comments: {
        academic: [],
        participation: [],
        wellness: [],
        innovation: []
      },
      commentAuthors: []
    };
  }

  componentWillMount() {
    this.getStudentFromFirebase();
    this.getCommentsOfStudentFromFirebase();
  }

  getStudentFromFirebase() {
    const studentId = this.props.match.params.id;
    firebase
      .database()
      .ref(`students/${studentId}`)
      .on('value', snapshot => {
        if (!snapshot.val()) {
          this.setState({
            notFound: true
          });
          return;
        }
        this.getForumOfStudentFromFirebase(snapshot.val().forum);
        this.setState({
          student: FirebaseHelper.snapshotWithUid(snapshot)
        });
      });
  }

  getForumOfStudentFromFirebase(forumId) {
    firebase.database()
      .ref(`forums/${forumId}`)
      .once('value', snapshot => {
        this.setState({
          forum: snapshot.val(),
        });
      });
  }

  changeStudentRating(data) {
    const studentId = this.props.match.params.id;
    firebase
      .database()
      .ref(`students/${studentId}`)
      .update({
        rating: data.rating
      });
    this.setState({
      student: Object.assign({}, this.state.student, { rating: data.rating })
    });
  }

  componentWillUnmount() {
    firebase.database().ref('students').off();
    firebase.database().ref('forums').off();
  }

  getCommentsOfStudentFromFirebase() {
    const studentId = this.props.match.params.id;
    const commentCategories = ['academic', 'participation', 'wellness', 'innovation'];
    commentCategories.forEach(category => {
      firebase
        .database()
        .ref('comments/' + category)
        .orderByChild('student')
        .equalTo(studentId)
        .on('value', snapshot => {
          const comments = this.state.comments;
          comments[category] = FirebaseHelper.snapshotToArray(snapshot) || [];
          this.setState({
            comments: comments,
            loading: false
          });
        });
    });
  }

  calculateAcademicRating() {
    let rating = 0;
    this.state.comments.academic.forEach(comment => {
      const category = comment.category;
      if (category === 'Absence') {
        rating -= 2;
      } else if (category === 'Late Submission') {
        rating -= 1;
      } else if (category === 'No Submission') {
        rating -= 1;
      } else if (category === 'Disruptive Behaviour') {
        rating -= 1;
      }
    });
    return rating;
  }

  calculateParticipationRating() {
    let rating = 0;
    this.state.comments.participation.forEach(comment => {
      const category = comment.category;
      if (category === 'Co-curricular') {
        rating += 1;
      } else if (category === 'Mentor') {
        rating += 1;
      } else if (category === 'Committee') {
        rating += 1;
      } else if (category === 'Community') {
        rating += 1;
      }
    });
    return rating;
  }

  render() {
    if (this.state.notFound) {
      return (
        <Redirect to='/404' />
      );
    }

    if ((this.state.forum && 
      (this.state.forum.createdBy !== this.props.user.uid)) && 
      this.props.user.role !== 'admin') {
      return (
        <Redirect to='/permissions' />
      );
    }

    return (
      <div style={{ padding: '40px' }}>
        {this.state.loading &&
          <Dimmer active>
            <Loader />
          </Dimmer>
        }
        {!this.state.loading && this.state.student && this.state.forum &&
          <div>
            <Grid verticalAlign='middle' divided='vertically'>
              <Grid.Row columns={3}>
                <Grid.Column>
                  <Header as='h1' icon textAlign='center'>
                    <Icon name='user' circular />
                  </Header>
                </Grid.Column>
                <Grid.Column textAlign='center'>
                  <Header as='h1' icon textAlign='center'>
                    <Header.Content>
                      {this.state.student.name}
                    </Header.Content>
                    <Header.Subheader>
                      {this.state.student.CCID}
                    </Header.Subheader>
                    <Header.Subheader>
                      <Link to={`/forums/${this.state.student.forum}`}>
                        Forum {this.state.forum.year + this.state.forum.letter}
                      </Link>
                    </Header.Subheader>
                  </Header>
                </Grid.Column>
                <Grid.Column textAlign='center'>
                  <Statistic color='teal'>
                    <Statistic.Value>
                      <Icon name='empty star' />
                      {this.state.student.rating}
                    </Statistic.Value>
                    <Statistic.Label>Rating</Statistic.Label>
                  </Statistic>
                </Grid.Column>
              </Grid.Row>
              <Grid.Row centered>
                <AcademicCommentForm
                  createdBy={this.props.user}
                  student={this.state.student}
                />
                <ParticipationCommentForm
                  createdBy={this.props.user}
                  student={this.state.student}
                />
                <InnovationCommentForm
                  createdBy={this.props.user}
                  student={this.state.student}
                />
                <WellnessCommentForm
                  createdBy={this.props.user}
                  student={this.state.student}
                />
              </Grid.Row>
            </Grid>
            <Grid columns={3}>
              <Grid.Row>
                <Grid.Column>
                  <Segment>
                    <Label as='a' color='orange' ribbon>Academic</Label>
                    <Statistic horizontal size='mini' floated='right' color='red'>
                      <Statistic.Value>{this.calculateAcademicRating()}</Statistic.Value>
                      <Statistic.Label>Rating</Statistic.Label>
                    </Statistic>
                    <AcademicCommentsList
                      comments={this.state.comments.academic}
                      user={this.props.user}
                    />
                  </Segment>
                </Grid.Column>
                <Grid.Column>
                  <Segment>
                    <Label as='a' color='blue' ribbon>Participation</Label>
                    <Statistic horizontal size='mini' floated='right' color='blue'>
                      <Statistic.Value>{this.calculateParticipationRating()}</Statistic.Value>
                      <Statistic.Label>Rating</Statistic.Label>
                    </Statistic>
                    <ParticipationCommentsList
                      comments={this.state.comments.participation}
                      user={this.props.user}
                    />
                  </Segment>
                </Grid.Column>
                <Grid.Column>
                  <Segment>
                    <Label as='a' color='red' ribbon>Innovation</Label>
                    <InnovationCommentsList
                      comments={this.state.comments.innovation}
                      user={this.props.user}
                    />
                  </Segment>
                </Grid.Column>
              </Grid.Row>
            </Grid>
            <Segment>
              <Label as='a' color='green' ribbon>Wellness</Label>
              <WellnessCommentsList
                comments={this.state.comments.wellness}
                user={this.props.user}
              />
            </Segment>
          </div>
        }
      </div>
    );
  }
}

export default StudentPage;