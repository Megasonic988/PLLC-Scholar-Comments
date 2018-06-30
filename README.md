# Teaching Assistant for Teaching Assistants App | PLLC

This app manages feedback for students in the PLLC, the Peter Lougheed Leadership College at the University of Alberta. It is built with React and uses Firebase for hosting and database functionality. [Video Demo](https://drive.google.com/file/d/0BwCsZcUwkOmBWDVXbFVoQU0tc28/view?usp=sharing)

## Setup

```
yarn install
```

## Deployment

### 1. Local
To deploy the app locally, run 
```
yarn start
```

### 2. Production
To deploy the app to Firebase hosting, run
```
yarn build
firebase deploy
```
Both the app and the Firebase functions (to handle email, etc.) will be deployed.

### Notes
When the app is deployed locally, the environment variable `NODE_ENV` is set to `development`, causing the app to use a separate test database in Firebase. No data is shared between the test and production databases.

## App Structure

- The Firebase configuration is located in index.js
- React Router is used to navigate to pages based on URL. The root routing functionality is implemented in App.js
- Pages (in src/pages) are composed of components (in src/components)

## Cloud Functions
The email handler is implemented with Firebase functions. The username and password of the email account are set with [environment configuration](https://firebase.google.com/docs/functions/config-env). To run the Firebase function locally, you must download the configuration with `firebase functions:config:get > .runtimeconfig.json`.

## Authenticating New Users

Users must sign in with their Google account to enter the app. However, an administrator (with access to Firebase console) must manually authenticate the user before they can use the app. Data access is prevented for unauthenticated users through database rules in Firebase. The instructions for how to authenticate users are provided in the Admin Tutorial.