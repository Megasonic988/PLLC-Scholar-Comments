import React, { Component } from 'react';
import * as firebase from 'firebase';
import * as FirebaseHelper from '../FirebaseHelper';
import { Dimmer, Loader, Label, Feed, Icon, Image } from 'semantic-ui-react';
import { Link, Redirect } from 'react-router-dom';
import moment from 'moment';

import FollowUpForm from '../components/FollowUpForm';

class Comment extends React.Component {
  constructor() {
    super();
    this.state = {
      author: null,
      student: null
    };
  }

  componentWillMount() {
    this.getAuthorOfCommentFromFirebase();
    this.getStudentOfCommentFromFirebase();
  }

  getAuthorOfCommentFromFirebase() {
    const authorId = this.props.comment.createdBy;
    firebase
      .database()
      .ref(`users/${authorId}`)
      .once('value', snapshot => {
        this.setState({
          author: FirebaseHelper.snapshotWithUid(snapshot)
        });
      });
  }

  getStudentOfCommentFromFirebase() {
    const studentId = this.props.comment.student;
    firebase
      .database()
      .ref(`students/${studentId}`)
      .once('value', snapshot => {
        this.setState({
          student: FirebaseHelper.snapshotWithUid(snapshot)
        });
      });
  }

  render() {
    if (!this.state.author) {
      return (
        <div></div>
      );
    }

    return (
      <Feed>
        <Feed.Event>
          <Feed.Label>
            <Image size='mini' shape='circular' src={this.state.author.photoURL} />
          </Feed.Label>
          <Feed.Content>
            <Feed.Summary>
              <Feed.User>{this.state.author.name}</Feed.User> wrote <a>{this.props.comment.title}</a>
              {this.state.student &&
                <span> for <Link to={`/students/${this.props.comment.student}`}>{this.state.student.name}</Link></span>
              }
              <span> in {this.props.comment.category}</span>
              <Feed.Date>{moment(this.props.comment.dateCreated).format('MMM Do YYYY, h:mm a')}</Feed.Date>
              {this.props.comment.attentionRequired &&
                <Label
                  as='a'
                  color='red'
                  size='mini'
                  tag
                  style={{ left: '6px' }}
                >
                  Attention Required
                <Icon name='delete' />
                </Label>
              }
            </Feed.Summary>
            <Feed.Extra text>
              <div dangerouslySetInnerHTML={{ __html: this.props.comment.text }} />
            </Feed.Extra>
            <Feed.Meta>
              <FollowUpForm
                comment={this.props.comment}
                user={this.props.user}
              />
            </Feed.Meta>
          </Feed.Content>
        </Feed.Event>
      </Feed>
    );
  }
}

class CommentPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      comment: null,
      loading: true,
      notFound: false
    };
  }

  componentWillMount() {
    this.getCommentFromFirebase();
  }

  componentWillUnmount() {
    firebase.database().ref('comments').off();
  }

  getCommentFromFirebase() {
    const commentId = this.props.match.params.id;
    firebase
      .database()
      .ref(`comments/${commentId}`)
      .on('value', snapshot => {
        if (!snapshot.val()) {
          this.setState({
            notFound: true
          });
          return;
        }
        this.setState({
          comment: FirebaseHelper.snapshotWithUid(snapshot),
          loading: false
        });
      });
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
        {!this.state.loading && this.state.comment &&
          <Comment
            comment={this.state.comment}
            user={this.props.user}
          />
        }
      </div>

    );
  }
}

export default CommentPage;