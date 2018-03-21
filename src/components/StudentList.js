import React from 'react';
import { List, Statistic } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

const StudentList = (props) => (
  <List divided relaxed>
    {props.students.map((student, index) => (
      <List.Item key={index}>
        <List.Icon name='user' size='large' verticalAlign='middle' />
        <List.Content>
          <List.Header>
            <Link to={`/students/${student.uid}`}>{student.name}</Link>
          </List.Header>
          <List.Description>
            <Statistic horizontal size='mini' color='teal'>
              <Statistic.Value>
                {student.rating}
              </Statistic.Value>
              <Statistic.Label>Rating</Statistic.Label>
            </Statistic>
          </List.Description>
        </List.Content>
      </List.Item>
    ))}
  </List>
);

export default StudentList;