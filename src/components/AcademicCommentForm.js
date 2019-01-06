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
}, {
  text: 'Participation (Good)',
  value: 'Participation (Good)'
}, {
  text: 'Participation (Poor)',
  value: 'Participation (Poor)'
}, {
  text: 'Other',
  value: 'Other'
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
}];

class AcademicCommentForm extends Component {
  constructor() {
    super();
    this.state = {
      open: false, // modal property
      text: '',
      category: null,
      notifiedOfAbsence: false,
      class: null,
      attentionRequired: false,
      categories: categories,
      classes: classes,
      dateCreated: moment()
    };
  }

  addComment() {
    this.setState({
      open: false
    });
    let text = this.state.text;
    if (this.state.category === 'Absence') {
      const absText = `<b>TF was ${this.state.notifiedOfAbsence ? '' : 'not'} notified of absence. </b>`;
      text = absText + text;
    }
    firebase
      .database()
      .ref('comments/academic')
      .push({
        text: text,
        category: this.state.category,
        class: this.state.class,
        dateCreated: this.state.dateCreated.toISOString(),
        student: this.props.student.uid,
        createdBy: this.props.createdBy.uid,
        attentionRequired: this.state.attentionRequired
      });
    const student = Object.assign({}, this.props.student);
    const category = this.state.category;
    if (category === 'Absence') {
      student.rating -= 2;
    } else if (category === 'Late Submission') {
      student.rating -= 1;
    } else if (category === 'No Submission') {
      student.rating -= 5;
    } else if (category === 'Disruptive Behaviour') {
      student.rating -= 1;
    } else if (category === 'Accommodation') {
      student.rating -= 1;
    } else if (category === 'Participation (Good)') {
      student.rating += 1;
    } else if (category === 'Participation (Poor)') {
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

  handleNotifiedOfAbsenceRadioChange = () => {
    this.setState({
      notifiedOfAbsence: !this.state.notifiedOfAbsence
    });
  }

  handleAttentionRequiredRadioChange = () => {
    this.setState({
      attentionRequired: !this.state.attentionRequired
    });
  }

  handleCategoryDropdownChange = (e, { value }) => this.setState({ category: value })

  handleClassDropdownChange = (e, { value }) => this.setState({ class: value })

  handleClassAddition = (e, { value }) => {
    this.setState({
      classes: [{ text: value, value }, ...this.state.classes],
    })
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
                search
                name='category'
                onChange={this.handleCategoryDropdownChange}
                options={this.state.categories}
              />
            </Form.Field>
            {this.state.category === 'Absence' &&
              <Form.Field>
                <label>Notified of Absence</label>
                <Radio
                  toggle
                  checked={this.state.notifiedOfAbsence}
                  name='notifiedOfAbsence'
                  onChange={this.handleNotifiedOfAbsenceRadioChange}
                />
              </Form.Field>
            }
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
                onAddItem={this.handleClassAddition}
                options={this.state.classes}
              />
            </Form.Field>
            <Form.Field>
              <label>Attention Required</label>
              <Radio
                toggle
                checked={this.state.attentionRequired}
                name='attentionRequired'
                onChange={this.handleAttentionRequiredRadioChange}
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