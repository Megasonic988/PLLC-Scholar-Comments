import React from 'react';
import { Card, Statistic } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';

class StudentCard extends React.Component {

  navigateToStudentPage() {
    this.props.history.push(`/students/${this.props.uid}`)
  }

  render() {
    return (
      <Card onClick={() => this.navigateToStudentPage()}>
        <Card.Content>
          <Card.Header>
            {this.props.name}
          </Card.Header>
          <Card.Meta>
            {this.props.CCID}
          </Card.Meta>
        </Card.Content>
        {this.props.user.role === 'admin' &&
          <Card.Content>
            <Statistic horizontal size='mini' color='teal'>
              <Statistic.Value>
                {this.props.rating}
              </Statistic.Value>
              <Statistic.Label>Rating</Statistic.Label>
            </Statistic>
          </Card.Content>
        }
      </Card>
    );
  }
}

StudentCard = withRouter(StudentCard);

export default StudentCard;


