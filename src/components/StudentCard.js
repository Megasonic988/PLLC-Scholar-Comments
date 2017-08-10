import React from 'react';
import { Card, Rating } from 'semantic-ui-react';
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
        <Card.Content>
          <Rating
            size='huge'
            disabled
            icon='star'
            defaultRating={this.props.rating}
            maxRating={5} />
        </Card.Content>
      </Card>
    );
  }
}

StudentCard = withRouter(StudentCard);

export default StudentCard;


