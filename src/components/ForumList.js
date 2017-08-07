import React, { Component } from 'react';
import { List } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

const ForumList = (props) => (
  <List divided relaxed>
    {props.forums.map(forum => (
      <List.Item key={forum.uid}>
        <List.Icon name='users' size='large' verticalAlign='middle' />
        <List.Content>
          <List.Header>
            <Link to={`/forums/${forum.uid}`}>Forum {forum.year + forum.letter}</Link>
          </List.Header>
          <List.Description>
            {forum.name}
          </List.Description>
        </List.Content>
      </List.Item>
    ))}
  </List>
);

export default ForumList;