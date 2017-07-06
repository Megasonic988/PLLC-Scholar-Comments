import React, { Component } from 'react';
import * as firebase from 'firebase';
import CommentsList from '../components/CommentsList';
import { Grid, Header, Icon, Divider, Rating } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

class StudentPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      student: {
        id: this.props.match.params.id,
        name: 'No Student Found',
        rating: 3
      },
      forum: null
    };
    const id = this.state.student.id;
    firebase.database().ref('students/' + id).once('value', snapshot => {
      if (!snapshot.val()) return;
      this.setState({
        student: Object.assign(snapshot.val(), { id: id })
      });
      firebase.database()
        .ref('forums/')
        .orderByChild('tf')
        .equalTo(snapshot.val().tf)
        .on('child_added', snapshot => {
          this.setState({
            forum: snapshot.val()
          });
        });
    });
  }
  changeStudentRating(data) {
    const id = this.state.student.id;
    firebase.database().ref('students/' + id).update({
      rating: data.rating
    });
    this.setState({
      student: Object.assign({}, this.state.student, { rating: data.rating })
    });
  }
  componentWillUnmount() {
    firebase.database().ref('students/').off();
    firebase.database().ref('forums/').off();
  }
  render() {
    return (
      <div style={{ padding: '40px' }}>
        <Grid columns={3} verticalAlign='middle'>
          <Grid.Row>
            <Grid.Column>
              <Header as='h1' icon textAlign='center'>
                <Icon name='user' circular />
              </Header>
            </Grid.Column>
            <Grid.Column>
              <Header as='h1' icon textAlign='center'>
                <Header.Content>
                  {this.state.student.name}
                </Header.Content>
                <Header.Subheader>
                  {this.state.student.CCID}
                </Header.Subheader>
                {this.state.forum ?
                  <Header.Subheader>
                    <Link to={'/tf/' + this.state.forum.tf}>Forum {this.state.forum.year + this.state.forum.letter}</Link>
                  </Header.Subheader> :
                  <div />
                }
              </Header>
            </Grid.Column>
            <Grid.Column textAlign='center'>
              <Rating
                size='huge'
                icon='star'
                rating={this.state.student.rating}
                maxRating={5}
                onRate={(e, data) => this.changeStudentRating(data)} />
            </Grid.Column>
          </Grid.Row>
        </Grid>
        <Divider />
        <CommentsList student={this.state.student} />
      </div>
    );
  }
}

export default StudentPage;