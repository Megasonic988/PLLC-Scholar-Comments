import React, { Component } from 'react';
import { Modal, Button, Form, Dropdown, Radio } from 'semantic-ui-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import * as firebase from 'firebase';
import Editor from 'react-medium-editor';
import 'medium-editor/dist/css/medium-editor.css';
import 'medium-editor/dist/css/themes/bootstrap.css';
import moment from 'moment';

const categories = [{
  text: 'Follow-up',
  value: 'Follow-up'
}, {
  text: 'Check-in',
  value: 'Check-in'
}, {
  text: 'Academic',
  value: 'Academic'
}, {
  text: 'Behaviour',
  value: 'Behaviour'
}, {
  text: 'Emergency',
  value: 'Emergency'
}];

class WellnessCommentEditForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false, // modal property
      uid: props.comment.uid,
      text: props.comment.text,
      category: props.comment.category,
      attentionRequired: props.comment.attentionRequired,
      categories: categories,
      dateCreated: moment(props.comment.dateCreated)
    };
  }

  editComment() {
    this.setState({
      open: false
    });
    firebase
      .database()
      .ref(`comments/wellness/${this.state.uid}`)
      .set({
        text: this.state.text,
        category: this.state.category,
        dateCreated: this.state.dateCreated.toISOString(),
        student: this.props.student.uid,
        createdBy: this.props.createdBy.uid,
        attentionRequired: this.state.attentionRequired
      });
  }

  handleTextChange(text) {
    this.setState({
      text: text
    });
  }

  handleCategoryDropdownChange = (e, { value }) => this.setState({ category: value })

  handleSubcategoryDropdownChange = (e, { value }) => this.setState({ subcategory: value })

  shouldComponentUpdate(nextProps, nextState) {
    if (this.state.text !== nextState.text) return false;
    else return true;
  }

  handleRadioChange = () => {
    this.setState({
      attentionRequired: !this.state.attentionRequired
    });
  }

  handleDateCreatedChange = (date) => {
    this.setState({
      dateCreated: date
    });
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
          Edit Wellness Comment for {this.props.student.name.split(' ')[0]}
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
            <Form.Field>
              <label>Category</label>
              <Dropdown
                placeholder='Select Category'
                fluid
                selection
                allowAdditions
                search
                value={this.state.category}
                name='category'
                onChange={this.handleCategoryDropdownChange}
                options={this.state.categories}
              />
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
          <Button onClick={() => this.editComment()} positive icon='edit' labelPosition='left' content='Submit' />
        </Modal.Actions>
      </Modal>
    );
  }
}

export default WellnessCommentEditForm;