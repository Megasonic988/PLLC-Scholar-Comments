import React, { Component } from 'react';
import moment from 'moment';
import * as firebase from 'firebase';
import * as FirebaseHelper from '../FirebaseHelper';
import { Statistic, Grid, Header, Icon, Dimmer, Loader, Segment, Label, Button } from 'semantic-ui-react';
import { Link, Redirect } from 'react-router-dom';

import AcademicCommentForm from '../components/AcademicCommentForm';
import WellnessCommentForm from '../components/WellnessCommentForm';
import InnovationCommentForm from '../components/InnovationCommentForm';

import AcademicCommentsList from '../components/AcademicCommentsList';
import WellnessCommentsList from '../components/WellnessCommentsList';
import InnovationCommentsList from '../components/InnovationCommentsList';

import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

class StudentPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      student: null,
      forum: null,
      loading: true,
      comments: {
        academic: [],
        wellness: [],
        innovation: []
      },
      commentAuthors: []
    };
  }

  componentWillMount() {
    this.getStudentFromFirebase();
    this.getCommentsOfStudentFromFirebase();
  }

  getStudentFromFirebase() {
    const studentId = this.props.match.params.id;
    firebase
      .database()
      .ref(`students/${studentId}`)
      .on('value', snapshot => {
        if (!snapshot.val()) {
          this.setState({
            notFound: true
          });
          return;
        }
        this.getForumOfStudentFromFirebase(snapshot.val().forum);
        this.setState({
          student: FirebaseHelper.snapshotWithUid(snapshot)
        });
      });
  }

  getForumOfStudentFromFirebase(forumId) {
    firebase.database()
      .ref(`forums/${forumId}`)
      .once('value', snapshot => {
        this.setState({
          forum: snapshot.val(),
        });
      });
  }

  componentWillUnmount() {
    firebase.database().ref('students').off();
    firebase.database().ref('forums').off();
  }

  getCommentsOfStudentFromFirebase() {
    const studentId = this.props.match.params.id;
    const commentCategories = ['academic', 'wellness', 'innovation'];
    commentCategories.forEach(category => {
      firebase
        .database()
        .ref('comments/' + category)
        .orderByChild('student')
        .equalTo(studentId)
        .on('value', snapshot => {
          const comments = this.state.comments;
          comments[category] = FirebaseHelper.snapshotToArray(snapshot) || [];
          this.setState({
            comments: comments,
            loading: false
          });
        });
    });
  }

  calculateAcademicRating() {
    let rating = 0;
    this.state.comments.academic.forEach(comment => {
      const category = comment.category;
      if (category === 'Absence') {
        rating -= 2;
      } else if (category === 'Late Submission') {
        rating -= 1;
      } else if (category === 'No Submission') {
        rating -= 1;
      } else if (category === 'Disruptive Behaviour') {
        rating -= 1;
      }
    });
    return rating;
  }

  generatePDFReport = () => {
    const student = this.state.student;
    const academicComments = [{ text: "Academic\n", style: 'header' }];
    this.state.comments.academic.forEach(ac => {
      academicComments.push({ text: `${moment(ac.dateCreated).format('MMMM D, YYYY')}\n`, style: 'bold' });
      if (ac.class) {
        academicComments.push({ text: `Class: ${ac.class}\n` });
      }
      if (ac.category) {
        academicComments.push({ text: `Category: ${ac.category}\n` })
      }
      if (ac.text.length && ac.text.length > 0) {
        academicComments.push({ text: `Details: ${ac.text.replace(/<(?:.|\n)*?>/gm, '')}\n` });
      }
      academicComments.push('\n');
    });
    academicComments.push('\n');
    const innovationComments = [{ text: "Innovation\n", style: 'header' }];
    this.state.comments.innovation.forEach(ic => {
      innovationComments.push({ text: `${moment(ic.dateCreated).format('MMMM D, YYYY')}\n`, style: 'bold' });
      if (ic.title) {
        innovationComments.push({ text: `Title: ${ic.title}\n` });
      }
      if (ic.text.length && ic.text.length > 0) {
        innovationComments.push({ text: `Details: ${ic.text.replace(/<(?:.|\n)*?>/gm, '')}\n` });
      }
      innovationComments.push('\n');
    });
    innovationComments.push('\n');
    const wellnessComments = [{ text: "Wellness\n", style: 'header' }];
    this.state.comments.wellness.forEach(wc => {
      wellnessComments.push({ text: `${moment(wc.dateCreated).format('MMMM D, YYYY')}\n`, style: 'bold' });
      if (wc.category) {
        wellnessComments.push({ text: `Category: ${wc.category}\n` })
      }
      if (wc.text.length && wc.text.length > 0) {
        wellnessComments.push({ text: `Details: ${wc.text.replace(/<(?:.|\n)*?>/gm, '')}\n` });
      }
      wellnessComments.push('\n');
    });
    wellnessComments.push('\n');
    const docDefinition = {
      content: [
        {
          text: [
            { text: `PLLC Report for ${student.name}\n`, style: 'header' },
            `Forum ${this.state.forum.year + this.state.forum.letter}\n`,
            "Created " + moment().format('MMMM D, YYYY') + '\n',
            `TAFTA PLLC App\n\n\n`,
          ]
        }, {
          text: academicComments
        }, {
          text: innovationComments
        }, {
          text: wellnessComments
        }
      ],
      styles: {
        header: {
          fontSize: 16,
          bold: true
        },
        header2: {
          fontSize: 13,
          bold: true
        },
        bold: {
          bold: true
        }
      }
    };
    const studentNameNoSpace = student.name.split(' ').join('');
    pdfMake.createPdf(docDefinition).download(`PLLC_${studentNameNoSpace}_Report_${moment().format('MM-DD-YYYY')}`);
  }

  render() {
    if (this.state.notFound) {
      return (
        <Redirect to='/404' />
      );
    }

    if ((this.state.forum &&
      (this.state.forum.createdBy !== this.props.user.uid)) &&
      this.props.user.role !== 'admin') {
      return (
        <Redirect to='/permissions' />
      );
    }

    return (
      <div style={{ padding: '40px' }}>
        {this.state.loading &&
          <Dimmer active>
            <Loader />
          </Dimmer>
        }
        {!this.state.loading && this.state.student && this.state.forum &&
          <div>
            <Grid verticalAlign='middle' divided='vertically'>
              <Grid.Row columns={3}>
                <Grid.Column>
                  <Header as='h1' icon textAlign='center'>
                    <Icon name='user' circular />
                  </Header>
                </Grid.Column>
                <Grid.Column textAlign='center'>
                  <Header as='h1' icon textAlign='center'>
                    <Header.Content>
                      {this.state.student.name}
                    </Header.Content>
                    <Header.Subheader>
                      {this.state.student.CCID}
                    </Header.Subheader>
                    <Header.Subheader>
                      <Link to={`/forums/${this.state.student.forum}`}>
                        Forum {this.state.forum.year + this.state.forum.letter}
                      </Link>
                    </Header.Subheader>
                    {this.props.user.role === 'admin' &&
                      <Header.Subheader>
                        <br />
                        <Button
                          compact
                          size='tiny'
                          onClick={this.generatePDFReport}>
                          Generate PDF Report
                        </Button>
                      </Header.Subheader>
                    }
                  </Header>
                </Grid.Column>
                {this.props.user.role === 'admin' &&
                  <Grid.Column textAlign='center'>
                    <Statistic color='teal'>
                      <Statistic.Value>
                        <Icon name='empty star' />
                        {this.state.student.rating}
                      </Statistic.Value>
                      <Statistic.Label>Rating</Statistic.Label>
                    </Statistic>
                  </Grid.Column>
                }
              </Grid.Row>
              <Grid.Row centered>
                <AcademicCommentForm
                  createdBy={this.props.user}
                  student={this.state.student}
                />
                <InnovationCommentForm
                  createdBy={this.props.user}
                  student={this.state.student}
                />
                <WellnessCommentForm
                  createdBy={this.props.user}
                  student={this.state.student}
                />
              </Grid.Row>
            </Grid>
            <Grid columns={3}>
              <Grid.Row>
                <Grid.Column>
                  <Segment>
                    <Label color='orange' ribbon>Academic</Label>
                    {this.props.user.role === 'admin' &&
                      <Statistic horizontal size='mini' floated='right' color='red'>
                        <Statistic.Value>{this.calculateAcademicRating()}</Statistic.Value>
                        <Statistic.Label>Rating</Statistic.Label>
                      </Statistic>
                    }
                    <AcademicCommentsList
                      comments={this.state.comments.academic}
                      user={this.props.user}
                    />
                  </Segment>
                </Grid.Column>
                <Grid.Column>
                  <Segment>
                    <Label color='red' ribbon>Innovation</Label>
                    <InnovationCommentsList
                      comments={this.state.comments.innovation}
                      user={this.props.user}
                    />
                  </Segment>
                </Grid.Column>
                <Grid.Column>
                  <Segment>
                    <Label color='green' ribbon>Wellness</Label>
                    <WellnessCommentsList
                      comments={this.state.comments.wellness}
                      user={this.props.user}
                    />
                  </Segment>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </div>
        }
      </div>
    );
  }
}

export default StudentPage;