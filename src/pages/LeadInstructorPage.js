import React, { Component } from 'react';
import { Header, Divider, List, Rating } from 'semantic-ui-react';
import * as firebase from 'firebase';

class LeadInstructorPage extends Component {
  constructor() {
    super();
    this.state = {
      forums: [],
      lowRatingStudents: []
    };
    firebase.database().ref('forums/').on('child_added', snapshot => {
      const forums = JSON.parse(JSON.stringify(this.state.forums));
      forums.push(Object.assign(snapshot.val(), { id: snapshot.getKey() }));
      this.setState({
        forums: forums
      });
    });
    firebase.database().ref('students/').on('child_added', snapshot => {
      if (snapshot.val().rating <= 2) {
        const lowRatingStudents = JSON.parse(JSON.stringify(this.state.lowRatingStudents));
        lowRatingStudents.push(Object.assign(snapshot.val(), { id: snapshot.getKey() }));
        this.setState({
          lowRatingStudents: lowRatingStudents
        });
      }
    });
  }
  getForumsInYear(year) {
    return this.state.forums.filter(f => f.year === String(year)).sort((f1, f2) => {
      if (f1.letter < f2.letter) return -1;
      else if (f1.letter > f2.letter) return 1;
      else return 0;
    });
  }
  getForumListItem(forum) {
    return (
      <List.Item key={forum.tf}>
        <List.Icon name='users' size='large' verticalAlign='middle' />
        <List.Content>
          <List.Header as='a' href={'/tf/' + forum.tf}>
            Forum {forum.year + forum.letter}
          </List.Header>
          <List.Description>
            {forum.name}
          </List.Description>
        </List.Content>
      </List.Item>
    );
  }
  render() {
    return (
      <div style={{ padding: '40px' }}>
        <Header as='h1'>First Year Forums</Header>
        <Divider />
        <List divided relaxed>
          {this.getForumsInYear(1).map(forum => this.getForumListItem(forum))}
        </List>
        <Header as='h1'>Second Year Forums</Header>
        <Divider />
        <List divided relaxed>
          {this.getForumsInYear(2).map(forum => this.getForumListItem(forum))}
        </List>
        <Divider />
        <Header as='h1'>Low-Rated Students</Header>
        <List divided relaxed>
          {this.state.lowRatingStudents.map((student, index) => (
            <List.Item key={index}>
              <List.Icon name='user' size='large' verticalAlign='middle' />
              <List.Content>
                <List.Header as='a' href={'/student/' + student.id}>
                  {student.name}
                </List.Header>
                <List.Description>
                  <Rating
                    size='small'
                    disabled
                    icon='star'
                    rating={student.rating}
                    maxRating={5} />
                </List.Description>
              </List.Content>
            </List.Item>
          ))}
        </List>
      </div>
    );
  }
}

export default LeadInstructorPage;