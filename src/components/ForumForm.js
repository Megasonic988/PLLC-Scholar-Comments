import React, { Component } from 'react';
import { Button, Modal, Form, Input } from 'semantic-ui-react';
import * as firebase from 'firebase';

class ForumForm extends Component {
  constructor() {
    super();
    this.state = {
      year: '',
      letter: '',
      name: '',
      open: false
    };
  }

  addForum() {
    this.setState({
      open: false
    });
    firebase
      .database()
      .ref('forums')
      .push({
        year: this.state.year,
        letter: this.state.letter,
        name: this.state.name,
        createdBy: this.props.createdBy,
        graduated: false
      });
  }

  handleChange(event) {
    const value = event.target.value;
    const name = event.target.name;
    this.setState({
      [name]: value
    });
  }

  render() {
    return (
      <Modal
        trigger={
          <Button
            onClick={() => this.setState({ open: true })}
            content='Add Forum'
            color='green'
            icon='users' />
        }
        open={this.state.open}>
        <Modal.Header>
          Add Forum
        </Modal.Header>
        <Modal.Content>
          <Form>
            <Form.Field>
              <label>Year</label>
              <Input name='year' onChange={this.handleChange.bind(this)} placeholder='e.g. 1, 2...' />
            </Form.Field>
            <Form.Field>
              <label>Letter</label>
              <Input name='letter' onChange={this.handleChange.bind(this)} placeholder='e.g. A, B...' />
            </Form.Field>
            <Form.Field>
              <label>Name</label>
              <Input name='name' onChange={this.handleChange.bind(this)} placeholder='e.g. Fun Forum...' />
            </Form.Field>
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button negative onClick={() => this.setState({ open: false })}>
            Cancel
          </Button>
          <Button onClick={() => this.addForum()} positive icon='edit' labelPosition='left' content='Okay' />
        </Modal.Actions>
      </Modal>
    );
  }
}

export default ForumForm;