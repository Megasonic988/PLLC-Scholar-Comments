import React, { Component } from 'react';
import { Button, Form, Container, Modal } from 'semantic-ui-react';
import * as firebase from 'firebase';

class StudentForm extends Component {
  constructor() {
    super();
    this.state = {
      name: null,
      CCID: null,
      open: false
    };
  }

  handleChange(event) {
    const value = event.target.value;
    const name = event.target.name;
    this.setState({
      [name]: value
    });
  }

  addStudent() {
    firebase.database().ref('students').push({
      name: this.state.name,
      CCID: this.state.CCID,
      forum: this.props.forum,
      rating: 3,
    });
  }

  render() {
    return (
      <Modal
        trigger={
          <Button
            onClick={() => this.setState({ open: true })}
            content='Add Student'
            color='yellow'
            icon='plus' />
        }
        open={this.state.open}>
        <Modal.Header>
          Add Student
        </Modal.Header>
        <Modal.Content>
          <Form>
            <Form.Field>
              <label>Name</label>
              <input name="name" placeholder="Enter name..." onChange={this.handleChange.bind(this)} />
            </Form.Field>
            <Form.Field>
              <label>CCID</label>
              <input name="CCID" placeholder="Enter CCID..." onChange={this.handleChange.bind(this)} />
            </Form.Field>
            <Button color='green' onClick={() => this.createNewStudent()}>Add Student</Button>
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button negative onClick={() => this.setState({ open: false })}>
            Cancel
          </Button>
          <Button onClick={() => this.addStudent()} positive icon='edit' labelPosition='left' content='Okay' />
        </Modal.Actions>
      </Modal>

    );
  }
}

export default StudentForm;