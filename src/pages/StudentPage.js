import React, { Component } from 'react';
import * as firebase from 'firebase';
import * as FirebaseHelper from '../FirebaseHelper';
import { Grid, Header, Icon, Rating, Dimmer, Loader, Segment, Label } from 'semantic-ui-react';
import { Link, Redirect } from 'react-router-dom';

import AcademicCommentForm from '../components/AcademicCommentForm';
import ParticipationCommentForm from '../components/ParticipationCommentForm';
import WellnessCommentForm from '../components/WellnessCommentForm';
import InnovationCommentForm from '../components/InnovationCommentForm';
import CommentsList from '../components/CommentsList';

class StudentPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      student: null,
      forum: null,
      loading: true,
      comments: [],
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
          loading: false
        });
      });
  }

  getCommentsOfStudentFromFirebase() {
    const studentId = this.props.match.params.id;
    firebase
      .database()
      .ref('comments')
      .orderByChild('student')
      .equalTo(studentId)
      .on('value', snapshot => {
        this.setState({
          comments: FirebaseHelper.snapshotToArray(snapshot) || []
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

  commentsByCategory() {
    const categoryToCommentsMap = {};
    this.state.comments.forEach(comment => {
      if (categoryToCommentsMap[comment.category]) {
        categoryToCommentsMap[comment.category].push(comment)
      } else {
        categoryToCommentsMap[comment.category] = [comment];
      }
    });
    const categories = Object.keys(categoryToCommentsMap);
    categories.sort();
    const arrayOfCommentsByCategory = categories.map(category => categoryToCommentsMap[category]);
    return arrayOfCommentsByCategory;
  }

  render() {
    if (this.state.notFound) {
      return (
        <Redirect to='/404' />
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
                  <Rating
                    size='huge'
                    icon='star'
                    rating={this.state.student.rating}
                    maxRating={5}
                    onRate={(e, data) => this.changeStudentRating(data)} />
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
                <WellnessCommentForm
                  createdBy={this.props.user}
                  student={this.state.student}
                />
                <InnovationCommentForm
                  createdBy={this.props.user}
                  student={this.state.student}
                />
              </Grid.Row>
            </Grid>
            {this.commentsByCategory().map((comments, index) => (
              <Segment key={index}>
                <Label as='a' color='orange' ribbon>{comments[0].category}</Label>
                <CommentsList
                  comments={comments}
                  user={this.props.user}
                />
              </Segment>
            ))}
          </div>
        }
      </div>
    );
  }
}

export default StudentPage;