import React, { Component } from 'react';
import { Modal, Button, Form } from 'semantic-ui-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import * as firebase from 'firebase';
import Editor from 'react-medium-editor';
import 'medium-editor/dist/css/medium-editor.css';
import 'medium-editor/dist/css/themes/bootstrap.css';
import moment from 'moment';

class InnovationCommentEditForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      uid: props.comment.uid,
      title: props.comment.title,
      text: props.comment.text,
      open: false,
      dateCreated: moment(props.comment.dateCreated)
    };
  }

  editComment() {
    this.setState({
      open: false
    });
    firebase
      .database()
      .ref(`comments/innovation/${this.state.uid}`)
      .set({
        title: this.state.title,
        text: this.state.text,
        dateCreated: this.state.dateCreated.toISOString(),
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

  handleDateCreatedChange = (date) => {
    this.setState({
      dateCreated: date
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
          <a onClick={() => this.setState({ open: true })}>
            Edit
          </a>
        }
        open={this.state.open}>
        <Modal.Header>
          Edit Innovation Comment for {this.props.student.name.split(' ')[0]}
        </Modal.Header>
        <Modal.Content>
          <Form>
            <Form.Field>
              <label>Date</label>
              <DatePicker
                selected={this.state.dateCreated}
                onChange={this.handleDateCreatedChange}
              />
            </Form.Field>
            <Form.Input
              label="Title"
              placeholder="Write a title..."
              defaultValue={this.state.title}
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
          <Button onClick={() => this.editComment()} positive icon='edit' labelPosition='left' content='Submit' />
        </Modal.Actions>
      </Modal>
    );
  }
}

export default InnovationCommentEditForm;