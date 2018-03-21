import React from 'react';
import * as firebase from 'firebase';
import * as FirebaseHelper from '../FirebaseHelper';
import { Feed, Icon, Image } from 'semantic-ui-react';
import moment from 'moment';

class InnovationCommentFeedEvent extends React.Component {
  constructor() {
    super();
    this.state = {
      author: null,
      student: null
    };
  }

  componentWillMount() {
    this.getAuthorOfCommentFromFirebase();
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

  addLike() {
    const comment = Object.assign({}, this.props.comment);
    comment.likes += 1;
    firebase
      .database()
      .ref(`comments/innovation/${this.props.comment.uid}`)
      .set(comment);
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
            {this.props.comment.title}
            <Feed.Date>
              {moment(this.props.comment.dateCreated).format('MMM Do YYYY')}
            </Feed.Date>
          </Feed.Summary>
          {this.props.comment.text &&
            <Feed.Extra text>
              <div dangerouslySetInnerHTML={{ __html: this.props.comment.text }} />
            </Feed.Extra>
          }
          <Feed.Meta>
            Submitted by {this.state.author.displayName}
          </Feed.Meta>
          <br />
          <Feed.Meta>
            <Feed.Like onClick={this.addLike.bind(this)}>
              <Icon name='like' />
              {this.props.comment.likes} Like{this.props.comment.likes === 1 ? '' : 's'}
            </Feed.Like>
          </Feed.Meta>
        </Feed.Content>
      </Feed.Event>

    );
  }
}

class InnovationCommentsList extends React.Component {
  render() {
    return (
      <Feed>
        {this.props.comments.map((comment, index) => (
          <InnovationCommentFeedEvent
            comment={comment}
            key={index}
            user={this.props.user}
          />
        ))}
      </Feed>
    );
  }
}

export default InnovationCommentsList;