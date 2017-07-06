import React, { Component } from 'react';
import * as firebase from 'firebase';
import { Button, Form, Modal, TextArea, Grid, Accordion, Icon, Rating } from 'semantic-ui-react';
import moment from 'moment';

class AddStudentCommentModal extends Component {
  constructor() {
    super();
    this.state = {
      text: null,
      open: false
    };
  }
  addStudentComment() {
    this.setState({
      open: false
    });
    firebase.database().ref('comments').push({
      text: this.state.text,
      date: new Date().toISOString(),
      student: this.props.student.id,
      rating: this.props.student.rating
    });
  }
  handleChange(event) {
    const value = event.target.value;
    const name = event.target.name;
    this.setState({
      [name]: value
    });
  }
  render() {
    return (
      <Modal
        trigger={
          <Button
            onClick={() => this.setState({ open: true })}
            content='Add Comment'
            color='green'
            icon='edit'
            label={{ as: 'a', color: 'green', pointing: 'left', basic: true, content: this.props.numComments }} />
        }
        open={this.state.open}>
        <Modal.Header>
          Add New Comment for {this.props.student.name.split(' ')[0]}
        </Modal.Header>
        <Modal.Content>
          <Form>
            <TextArea rows={15} name='text' onChange={this.handleChange.bind(this)} placeholder='Write a comment...' />
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button negative onClick={() => this.setState({ open: false })}>
            Cancel
          </Button>
          <Button onClick={() => this.addStudentComment()} positive icon='edit' labelPosition='left' content='Submit' />
        </Modal.Actions>
      </Modal>
    );
  }
}

class CommentsList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      comments: []
    };
    firebase.database().ref('comments')
      .orderByChild('student')
      .equalTo(this.props.student.id)
      .on('child_added', snapshot => {
        const comments = JSON.parse(JSON.stringify(this.state.comments));
        comments.push(snapshot.val());
        comments.sort((c1, c2) => {
          if (c1.date > c2.date) {
            return -1;
          } else if (c1.date < c2.date) {
            return 1;
          } else {
            return 1;
          }
        });
        this.setState({
          comments: comments
        });
      });
  }
  componentWillUnmount() {
    firebase.database().ref('comments').off();
  }
  render() {
    return (
      <Grid>
        <Grid.Row centered>
          <AddStudentCommentModal student={this.props.student} numComments={this.state.comments.length} />
        </Grid.Row>
        <Grid.Row style={{paddingLeft: '15%', paddingRight: '15%'}}>
          {this.state.comments.map((comment, index) => (
            <Accordion styled fluid>
              <Accordion.Title>
                <Icon name='dropdown' />
                Comment on {moment(comment.date).format('MMMM Do YYYY')}{' '}|{' '}
                <Rating
                  key={index}
                  size='small'
                  disabled
                  icon='star'
                  rating={comment.rating}
                  maxRating={5} />
              </Accordion.Title>
              <Accordion.Content>
                <p>{comment.text}</p>
              </Accordion.Content>
            </Accordion>
          ))}
        </Grid.Row>
      </Grid>
    );
  }
}

export default CommentsList;