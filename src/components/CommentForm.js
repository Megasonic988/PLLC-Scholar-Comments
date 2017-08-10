import React, { Component } from 'react';
import { Modal, Button, Form, TextArea, Dropdown, Radio, Rating } from 'semantic-ui-react';
import * as firebase from 'firebase';
import Editor from 'react-medium-editor';
import 'medium-editor/dist/css/medium-editor.css';
import 'medium-editor/dist/css/themes/bootstrap.css';

const commentCategories = [{
  text: 'Academic',
  value: 'Academic'
}, {
  text: 'Personal Wellness',
  value: 'Personal Wellness'
}, {
  text: 'Other',
  value: 'Other'
}];

class CommentForm extends Component {
  constructor() {
    super();
    this.state = {
      title: '',
      text: '',
      category: commentCategories[0].value,
      attentionRequired: false,
      open: false,
      commentCategories: commentCategories
    };
  }

  addComment() {
    this.setState({
      open: false
    });
    firebase.database().ref('comments').push({
      title: this.state.title,
      text: this.state.text,
      category: this.state.category,
      dateCreated: new Date().toISOString(),
      student: this.props.student.uid,
      rating: this.props.student.rating,
      createdBy: this.props.createdBy.uid,
      attentionRequired: this.state.attentionRequired
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

  handleDropdownChange = (e, { value }) => this.setState({ category: value })

  shouldComponentUpdate(nextProps, nextState) {
    if (this.state.text !== nextState.text) return false;
    else return true;
  }

  handleAddition = (e, { value }) => {
    this.setState({
      commentCategories: [{ text: value, value }, ...this.state.commentCategories],
    })
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
            <Form.Input
              label="Title"
              placeholder="Write a title..."
              name='title'
              onChange={this.handleChange.bind(this)} />
            <Form.Field>
              <label>Category</label>
              <Dropdown
                placeholder='Select Category'
                name
                fluid
                selection
                allowAdditions
                search
                value={this.state.category}
                name='category'
                onChange={this.handleDropdownChange}
                options={this.state.commentCategories}
                onAddItem={this.handleAddition}
              />
            </Form.Field>
            <Form.Field>
              <label>Rating</label>
              <Rating
                defaultRating={this.props.student.rating}
                maxRating={5}
                disabled />
            </Form.Field>
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
          <Button onClick={() => this.addComment()} positive icon='edit' labelPosition='left' content='Submit' />
        </Modal.Actions>
      </Modal>
    );
  }
}

export default CommentForm;