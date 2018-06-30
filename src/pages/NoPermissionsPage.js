import React from 'react';

const NoPermissionsPage = () => (
  <div style={{ textAlign: 'center', paddingTop: '20%' }}>
    <h1>You are not authorized to access this page</h1>
    <p>Teaching Fellows are only authorized to view their own forum and students.</p>
    <p>For permissions, please email Brandon at <a href="mailto:garib@ualberta.ca ">garib@ualberta.ca</a>.</p>
  </div>
);

export default NoPermissionsPage;