import React, { Component } from 'react';
import { Modal, Button, Form, Dropdown } from 'semantic-ui-react';
import * as firebase from 'firebase';
import Editor from 'react-medium-editor';
import 'medium-editor/dist/css/medium-editor.css';
import 'medium-editor/dist/css/themes/bootstrap.css';
import moment from 'moment';

const categories = [{
  text: 'Absence',
  value: 'Absence'
}, {
  text: 'Late Submission',
  value: 'Late Submission'
}, {
  text: 'No Submission',
  value: 'No Submission'
}, {
  text: 'Disruptive Behaviour',
  value: 'Disruptive Behaviour'
}, {
  text: 'Accommodation',
  value: 'Accommodation'
}];

const classes = [{
  text: 'Foundations of Leadership (INT D 301)',
  value: 'Foundations of Leadership (INT D 301)'
}, {
  text: 'Topics in Leadership (INT D 306)',
  value: 'Topics in Leadership (INT D 306)'
}, {
  text: 'Capstone in Leadership (INT D 406)',
  value: 'Capstone in Leadership (INT D 406)'
}, {
  text: 'Workshop in Leadership (INT D 407)',
  value: 'Workshop in Leadership (INT D 407)'
}, {
  text: 'Workshop',
  value: 'Workshop'
}];

class AcademicCommentForm extends Component {
  constructor() {
    super();
    this.state = {
      text: '',
      category: null,
      class: null,
      open: false,
      categories: categories,
      classes: classes
    };
  }

  addComment() {
    this.setState({
      open: false
    });
    firebase
      .database()
      .ref('comments/academic')
      .push({
        text: this.state.text,
        category: this.state.category,
        class: this.state.class,
        dateCreated: new Date().toISOString(),
        dateUpdated: new Date().toISOString(),
        student: this.props.student.uid,
        createdBy: this.props.createdBy.uid,
      });
    const student = Object.assign({}, this.props.student);
    const category = this.state.category;
    if (category === 'Absence') {
      student.rating -= 2;
    } else if (category === 'Late Submission') {
      student.rating -= 1;
    } else if (category === 'No Submission') {
      student.rating -= 1;
    } else if (category === 'Disruptive Behaviour') {
      student.rating -= 1;
    }
    firebase
      .database()
      .ref(`students/${this.props.student.uid}`)
      .set(student);
  }

  handleTextChange(text) {
    this.setState({
      text: text
    });
  }

  handleCategoryDropdownChange = (e, { value }) => this.setState({ category: value })

  handleClassDropdownChange = (e, { value }) => this.setState({ class: value })

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
            content='Academic'
            color='orange'
            icon='edit'
          />
        }
        open={this.state.open}>
        <Modal.Header>
          Add New Academic Comment for {this.props.student.name.split(' ')[0]}
        </Modal.Header>
        <Modal.Content>
          <Form>
            <Form.Field>
              <label>Date</label>
              <p>{moment(new Date()).format('MMMM Do YYYY')}</p>
            </Form.Field>
            <Form.Field>
              <label>Category</label>
              <Dropdown
                placeholder='Select Category'
                fluid
                selection
                allowAdditions
                search
                name='category'
                onChange={this.handleCategoryDropdownChange}
                options={this.state.categories}
              />
            </Form.Field>
            <Form.Field>
              <label>Class</label>
              <Dropdown
                placeholder='Select Class'
                fluid
                selection
                allowAdditions
                search
                name='class'
                onChange={this.handleClassDropdownChange}
                options={this.state.classes}
              />
            </Form.Field>
            <Form.Field>
              <label>Comment (Optional)</label>
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

export default AcademicCommentForm;