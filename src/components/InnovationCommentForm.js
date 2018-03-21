import React, { Component } from 'react';
import { Modal, Button, Form } from 'semantic-ui-react';
import * as firebase from 'firebase';
import Editor from 'react-medium-editor';
import 'medium-editor/dist/css/medium-editor.css';
import 'medium-editor/dist/css/themes/bootstrap.css';
import moment from 'moment';

class InnovationCommentForm extends Component {
  constructor() {
    super();
    this.state = {
      title: '',
      text: '',
      open: false
    };
  }

  addComment() {
    this.setState({
      open: false
    });
    firebase
      .database()
      .ref('comments/innovation')
      .push({
        title: this.state.title,
        text: this.state.text,
        dateCreated: new Date().toISOString(),
        dateUpdated: new Date().toISOString(),
        student: this.props.student.uid,
        createdBy: this.props.createdBy.uid,
        likes: 0
      });
  }

  handleChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = event.target.name;
    this.setState({
      [name]: value
    });
  }

  handleTextChange(text) {
    this.setState({
      text: text
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.state.text !== nextState.text) return false;
    else return true;
  }

  render() {
    return (
      <Modal
        trigger={
          <Button
            onClick={() => this.setState({ open: true })}
            content='Innovation'
            color='red'
            icon='edit'
          />
        }
        open={this.state.open}>
        <Modal.Header>
          Add New Innovation Comment for {this.props.student.name.split(' ')[0]}
        </Modal.Header>
        <Modal.Content>
          <Form>
            <Form.Field>
              <label>Date</label>
              <p>{moment(new Date()).format('MMMM Do YYYY')}</p>
            </Form.Field>
            <Form.Input
              label="Title"
              placeholder="Write a title..."
              name='title'
              onChange={this.handleChange.bind(this)} />
            <Form.Field>
              <label>Comment</label>
              <Editor
                name='text'
                onChange={this.handleTextChange.bind(this)}
                text={this.state.text}
                options={{
                  toolbar: {
                    buttons: ['bold', 'italic', 'underline', 'anchor']
                  },
                  placeholder: {
                    text: 'Write your text. Highlight text to apply style editing (e.g. bold)'
                  }
                }}
              />
            </Form.Field>
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button negative onClick={() => this.setState({ open: false })}>
            Cancel
          </Button>
          <Button onClick={() => this.addComment()} positive icon='edit' labelPosition='left' content='Submit' />
        </Modal.Actions>
      </Modal>
    );
  }
}

export default InnovationCommentForm;