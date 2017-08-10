import React, { Component } from 'react';
import * as firebase from 'firebase';
import * as FirebaseHelper from '../FirebaseHelper';
import { Feed, Icon, Image, Rating, Label } from 'semantic-ui-react';
import moment from 'moment';
import Editor from 'react-medium-editor';
import 'medium-editor/dist/css/medium-editor.css';
import 'medium-editor/dist/css/themes/bootstrap.css';

import FollowUpForm from './FollowUpForm';

class CommentFeedEvent extends React.Component {
  constructor() {
    super();
    this.state = {
      author: null
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

  removeAttentionRequired() {
    console.log('remove')
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
            <Feed.User>{this.state.author.name}</Feed.User> wrote <a>{this.props.comment.title}</a>
            <Feed.Date>{moment(this.props.comment.dateCreated).format('MMM Do YYYY, h:mm a')}</Feed.Date>
            {this.props.comment.attentionRequired &&
              <Label
                as='a'
                color='red'
                size='mini'
                tag
                style={{left: '6px'}}
                onClick={this.removeAttentionRequired.bind(this)}
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

    );
  }
}

class CommentsList extends React.Component {
  render() {
    return (
      <Feed>
        {this.props.comments.map((comment, index) => (
          <CommentFeedEvent 
            comment={comment} 
            key={index} 
            user={this.props.user}
          />
        ))}
      </Feed>
    );
  }
}

export default CommentsList;