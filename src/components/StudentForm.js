import React, { Component } from 'react';
import { Button, Form, Container, Header } from 'semantic-ui-react';
import * as firebase from 'firebase';

class StudentForm extends Component {
  constructor() {
    super();
    this.state = {
      name: null,
      CCID: null
    };
  }
  handleChange(event) {
    const value = event.target.value;
    const name = event.target.name;
    this.setState({
      [name]: value
    });
  }
  createNewStudent() {
    firebase.database().ref('/students').push({
      name: this.state.name,
      CCID: this.state.CCID,
      tf: this.props.tf,
      rating: 3,
    }).then(() => {
      this.props.history.push('/tf/' + this.props.tf);
    });
  }
  render() {
    return (
      <div>
        <Header as='h1'>Add a Student</Header>
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
      </div>

    );
  }
}

export default StudentForm;