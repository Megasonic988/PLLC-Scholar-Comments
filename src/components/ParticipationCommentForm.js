import React, { Component } from 'react';
import { Modal, Button, Form, Dropdown } from 'semantic-ui-react';
import * as firebase from 'firebase';
import Editor from 'react-medium-editor';
import 'medium-editor/dist/css/medium-editor.css';
import 'medium-editor/dist/css/themes/bootstrap.css';
import moment from 'moment';

const categories = [{
  text: 'Co-curricular',
  value: 'Co-curricular'
}, {
  text: 'Mentor',
  value: 'Mentor'
}, {
  text: 'Committee',
  value: 'Committee'
}, {
  text: 'Community',
  value: 'Community'
}]

class ParticipationCommentForm extends Component {
  constructor() {
    super();
    this.state = {
      text: '',
      category: null,
      open: false,
      categories: categories,
    };
  }

  addComment() {
    this.setState({
      open: false
    });
    firebase
      .database()
      .ref('comments/participation')
      .push({
        text: this.state.text,
        category: this.state.category,
        dateCreated: new Date().toISOString(),
        dateUpdated: new Date().toISOString(),
        student: this.props.student.uid,
        createdBy: this.props.createdBy.uid,
      });
  }

  handleTextChange(text) {
    this.setState({
      text: text
    });
  }

  handleCategoryDropdownChange = (e, { value }) => this.setState({ category: value })

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
            content='Participation'
            color='green'
            icon='edit'
          />
        }
        open={this.state.open}>
        <Modal.Header>
          Add New Participation Comment for {this.props.student.name.split(' ')[0]}
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
                name='subcategory'
                onChange={this.handleCategoryDropdownChange}
                options={this.state.categories}
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

export default ParticipationCommentForm;