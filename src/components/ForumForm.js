import React, { Component } from 'react';
import { Button, Modal, Form, Input, Dropdown } from 'semantic-ui-react';
import * as firebase from 'firebase';

const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N'];
const LETTER_OPTIONS = letters.map(l => {
  return {
    text: l,
    value: l
  }
});
const years = ['1', '2'];
const YEAR_OPTIONS = years.map(l => {
  return {
    text: l,
    value: l
  }
});

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

  handleLetterDropdownChange = (e, { value }) => this.setState({ letter: value })
  handleYearDropdownChange = (e, { value }) => this.setState({ year: value })

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
              <Dropdown
                placeholder='Select Year'
                fluid
                selection
                name='year'
                onChange={this.handleYearDropdownChange}
                options={YEAR_OPTIONS}
              />
            </Form.Field>
            <Form.Field>
              <label>Letter</label>
              <Dropdown
                placeholder='Select Letter'
                fluid
                selection
                name='letter'
                onChange={this.handleLetterDropdownChange}
                options={LETTER_OPTIONS}
              />
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