import React, { Component } from 'react';
import { Modal, Button, Form, Radio } from 'semantic-ui-react';
import * as firebase from 'firebase';
import moment from 'moment';
import Editor from 'react-medium-editor';
import 'medium-editor/dist/css/medium-editor.css';
import 'medium-editor/dist/css/themes/bootstrap.css';

class FollowUpForm extends Component {
  constructor() {
    super();
    this.state = {
      text: '',
      attentionRequired: false,
      open: false,
    };
  }

  componentWillMount() {
    this.setState({
      attentionRequired: this.props.comment.attentionRequired
    });
  }

  updateComment() {
    this.setState({
      open: false
    });
    const followUpDate = moment(new Date()).format('MMM Do YYYY, h:mm a');
    const followUpAuthor = this.props.user.displayName;
    const followUpHeader = '<b>Follow Up (' + followUpDate + ' by ' + followUpAuthor + ')</b><br />';
    const followUpText = this.props.comment.text + followUpHeader + this.state.text;
    firebase
      .database()
      .ref(`comments/${this.props.comment.uid}`)
      .update({
        text: followUpText,
        attentionRequired: this.state.attentionRequired,
        dateUpdated: new Date().toISOString()
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

  handleRadioChange = () => {
    this.setState({
      attentionRequired: !this.state.attentionRequired
    });
  }

  render() {
    return (
      <Modal
        trigger={
          <a onClick={() => this.setState({ open: true })}>
            Add Follow-up
          </a>
        }
        open={this.state.open}>
        <Modal.Header>
          Add Follow Up to Comment {this.props.comment.title}
        </Modal.Header>
        <Modal.Content>
          <Form>
            <Form.Field>
              <label>Attention Required</label>
              <Radio
                toggle
                checked={this.state.attentionRequired}
                name='attentionRequired'
                onChange={this.handleRadioChange}
              />
            </Form.Field>
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
          <Button onClick={() => this.updateComment()} positive icon='edit' labelPosition='left' content='Submit' />
        </Modal.Actions>
      </Modal>
    );
  }
}

export default FollowUpForm;