import React, { Component } from 'react';
import { Button, Card, Grid, Rating, Header, Icon, Divider, Modal, Form, Input } from 'semantic-ui-react';
import { Switch, Route, Redirect } from 'react-router-dom';
import StudentFormPage from './StudentFormPage';
import * as firebase from 'firebase';

const StudentCard = (props) => {
  console.log(props);
  return (
    <Card href={'/student/' + props.id}>
      <Card.Content>
        <Card.Header>
          {props.name}
        </Card.Header>
        <Card.Meta>
          {props.CCID}
        </Card.Meta>
      </Card.Content>
      <Card.Content>
        <Rating
          size='huge'
          disabled
          icon='star'
          defaultRating={props.rating}
          maxRating={5} />
      </Card.Content>
    </Card>
  );
}

class AddForumModal extends Component {
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
    firebase.database().ref('forums/').push({
      year: this.state.year,
      letter: this.state.letter,
      name: this.state.name,
      tf: this.props.tf
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
            content='Add Forum Details'
            color='green'
            icon='tag' />
        }
        open={this.state.open}>
        <Modal.Header>
          Add Forum Details
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

class StudentList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      students: [],
      tf: this.props.match.params.id,
      forum: null
    };
    firebase.database()
      .ref('students/')
      .orderByChild('tf')
      .equalTo(this.state.tf)
      .on('child_added', snapshot => {
        const students = JSON.parse(JSON.stringify(this.state.students));
        students.push(Object.assign(snapshot.val(), { id: snapshot.getKey() }));
        this.setState({
          students: students,
        });
      });
    firebase.database()
      .ref('forums/')
      .orderByChild('tf')
      .equalTo(this.state.tf)
      .on('child_added', snapshot => {
        this.setState({
          forum: snapshot.val()
        });
      });
  }
  goToAddStudentPage() {
    const params = this.props.match.params;
    this.props.history.push('/tf/' + params.id + '/addstudent');
  }
  componentWillUnmount() {
    firebase.database().ref('students/').off();
    firebase.database().ref('forums/').off();
  }
  render() {
    return (
      <div style={{ padding: '40px' }}>
        <Grid>
          <Grid.Row columns={3} centered verticalAlign='middle'>
            <Grid.Column textAlign='center'>
              <Header as='h1' icon>
                <Icon name='users' />
              </Header>
            </Grid.Column>
            <Grid.Column textAlign='center'>
              {this.state.forum ?
                <Header as='h1' icon>
                  <Header.Content>
                    Forum {this.state.forum.year + this.state.forum.letter}
                  </Header.Content>
                  <Header.Subheader>
                    {this.state.forum.name}
                  </Header.Subheader>
                  <Header.Subheader style={{ paddingTop: '3px' }}>
                    {this.state.students.length + ' scholar' + (this.state.students.length === 1 ? '' : 's')}
                  </Header.Subheader>
                </Header> :
                <div>
                  <Header as='h1'>
                    <Header.Content>
                      New Forum
                    </Header.Content>
                  </Header>
                  <AddForumModal tf={this.state.tf} />
                </div>
              }
            </Grid.Column>
            <Grid.Column textAlign='center'>
              <Button
                onClick={() => this.goToAddStudentPage()}
                content='Add Student'
                color='yellow'
                icon='plus' />
            </Grid.Column>
          </Grid.Row>
          <Divider />
          <Grid.Row>
            <Card.Group>
              {this.state.students.map((student, index) => (
                <StudentCard key={index} {...student} />
              ))}
            </Card.Group>
          </Grid.Row>
        </Grid>
      </div>
    );
  }
}

class TeachingFellowPage extends Component {
  render() {
    return (
      <Switch>
        <Route exact path='/tf/:id' component={StudentList} />
        <Route exact path='/tf/:id/addstudent' component={StudentFormPage} />
        <Redirect to='/404' />
      </Switch>
    );
  }
}

export default TeachingFellowPage;