import React, { Component } from 'react';
import StudentForm from '../components/StudentForm';

const StudentFormPage = (props) => (
    <div style={{ padding: '40px' }}>
        <StudentForm tf={props.match.params.id} history={props.history}/>
    </div>
);

export default StudentFormPage;