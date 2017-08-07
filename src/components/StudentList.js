import React, { Component } from 'react';
import { List, Rating } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

const StudentList = (props) => (
	<List divided relaxed>
		{props.students.map((student, index) => (
			<List.Item key={index}>
				<List.Icon name='user' size='large' verticalAlign='middle' />
				<List.Content>
					<List.Header>
						<Link to={`/student/${student.uid}`}>{student.name}</Link>
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
);

export default StudentList;