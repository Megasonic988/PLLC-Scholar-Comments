import React from 'react';
import * as firebase from 'firebase';
import * as FirebaseHelper from '../FirebaseHelper';
import { Feed, Image, Label } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import moment from 'moment';

class InnovationCommentSummaryFeedEvent extends React.Component {
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
      <Feed.Event>
        <Feed.Label>
          <Image size='mini' shape='circular' src={this.state.author.photoURL} />
        </Feed.Label>
        <Feed.Content>
          <Feed.Summary>
            {this.props.comment.title} by{' '}
            <Link to={`/students/${this.props.comment.student}`}>{this.state.student.name}</Link>
            <Feed.Date>{moment(this.props.comment.dateCreated).format('MMM Do YYYY')}</Feed.Date>
            {this.props.comment.attentionRequired &&
              <Label
                as='a'
                color='grey'
                size='mini'
                tag
                style={{ left: '6px' }}
              >
                Attention Required
              </Label>
            }
          </Feed.Summary>
          {this.props.comment.text &&
            <Feed.Extra text>
              <div dangerouslySetInnerHTML={{ __html: this.props.comment.text }} />
            </Feed.Extra>
          }
          <Feed.Meta>
            Submitted by {this.state.author.displayName}
          </Feed.Meta>
          <br/>
          <Feed.Meta>
            <Link to={`/students/${this.props.comment.student}`}>View Student</Link>
          </Feed.Meta>
        </Feed.Content>
      </Feed.Event>

    );
  }
}

class InnovationCommentsSummaryList extends React.Component {
  render() {
    return (
      <Feed>
        {this.props.comments.map((comment, index) => (
          <InnovationCommentSummaryFeedEvent
            comment={comment}
            key={index}
            user={this.props.user}
          />
        ))}
      </Feed>
    );
  }
}

export default InnovationCommentsSummaryList;