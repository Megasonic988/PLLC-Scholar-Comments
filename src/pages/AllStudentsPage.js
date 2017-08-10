import React, { Component } from 'react';
import { Form, Radio, Dimmer, Loader, Grid } from 'semantic-ui-react';
import * as firebase from 'firebase';
import * as FirebaseHelper from '../FirebaseHelper';

import StudentList from '../components/StudentList';

class AllStudentsPage extends Component {
  constructor() {
    super();
    this.state = {
      students: [],
      sortBy: 'name'
    };
  }

  componentWillMount() {
    this.getStudentsFromFirebase();
  }

  componentWillUnmount() {
    firebase.database().ref('students').off();
  }

  getStudentsFromFirebase() {
    firebase
      .database()
      .ref('students')
      .on('value', snapshot => {
        this.setState({
          students: FirebaseHelper.snapshotToArray(snapshot) || [],
          loading: false
        });
      });
  }

  sortedStudents() {
    if (this.state.sortBy === 'name') {
      return this.state.students.sort((s1, s2) => {
        if (s1.name < s2.name) return -1;
        if (s2.name < s1.name) return 1;
        else return 0;
      });
    }
    else if (this.state.sortBy === 'rating') {
      return this.state.students.sort((s1, s2) => {
        if (s1.rating < s2.rating) return -1;
        if (s2.rating < s1.rating) return 1;
        else return 0;
      });
    }
    else return this.state.students;
  }

  handleChange = (e, { value }) => this.setState({ 
    sortBy: value 
  })

  render() {
    if (this.state.loading) {
      return (
        <Dimmer active>
          <Loader />
        </Dimmer>
      );
    }
    else {
      return (
        <div style={{ padding: '40px' }}>
          <Grid centered>
            <Form>
              <Form.Field>
                Sort by:
            </Form.Field>
              <Form.Field>
                <Radio
                  label='Name'
                  name='sortBy'
                  value='name'
                  checked={this.state.sortBy === 'name'}
                  onChange={this.handleChange}
                />
              </Form.Field>
              <Form.Field>
                <Radio
                  label='Rating'
                  name='sortBy'
                  value='rating'
                  checked={this.state.sortBy === 'rating'}
                  onChange={this.handleChange}
                />
              </Form.Field>
            </Form>
          </Grid>
          <StudentList students={this.sortedStudents()} />
        </div>
      );
    }
  }
}

export default AllStudentsPage;