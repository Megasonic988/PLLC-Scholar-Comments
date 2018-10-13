const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');

admin.initializeApp();

const GMAIL_EMAIL = functions.config().gmail.email;
const GMAIL_PASSWORD = functions.config().gmail.password;
const mailTransport = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: GMAIL_EMAIL,
    pass: GMAIL_PASSWORD,
  },
});

const APP_NAME = 'TAFTA | Teaching Assistants for Teaching Assistants App - PLLC';
const wellnessDefaultEmailRecipients = ['stasia@ualberta.ca'];

const academicLeadInstructors = {
  'Foundations of Leadership (INT D 301)': [
    "stasia@ualberta.ca"
  ],
  'Topics in Leadership (INT D 306)': [
    "rhonda.breitkreuz@ualberta.ca"
  ],
  'Capstone in Leadership (INT D 406)': [
    "ddavidso@ualberta.ca"
  ],
  'Workshop in Leadership (INT D 407)': [
    "minness@ualberta.ca"
  ]
}

exports.sendFlaggedWellnessEmail = functions.database.ref('/comments/wellness/{commentId}')
  .onCreate((snapshot) => {
    const comment = snapshot.val();
    if (!comment.attentionRequired) {
      return console.log("Attention not required. No email sent.");
    }
    const promises = [
      admin.database().ref(`students/${comment.student}`).once('value'),
      admin.database().ref(`users/${comment.createdBy}`).once('value')
    ];
    return Promise.all(promises).then(snapshots => {
      const student = snapshots[0].val();
      const tf = snapshots[1].val();
      const emailRecipients = wellnessDefaultEmailRecipients.concat(tf.email);
      const mailOptions = {
        from: `${APP_NAME} <${GMAIL_EMAIL}>`,
        to: emailRecipients,
        subject: `Flagged Wellness Entry for ${student.name}`,
        text: `A new wellness comment under category ${comment.category} has been created for ${student.name}. To view this comment, please visit https://tafta-pllc.firebaseapp.com/students/${comment.student}.\n\nThanks,\nTAFTA App`
      };
      return mailTransport.sendMail(mailOptions).then(() => {
        return console.log('New email sent');
      });
    });
  });

exports.sendResolvedWellnessEmail = functions.database.ref('/comments/wellness/{commentId}')
  .onUpdate((change) => {
    const beforeComment = change.before.val();
    const afterComment = change.after.val();
    if (!afterComment.attentionRequired && beforeComment.attentionRequired) {
      const promises = [
        admin.database().ref(`students/${afterComment.student}`).once('value'),
        admin.database().ref(`users/${afterComment.createdBy}`).once('value')
      ];
      return Promise.all(promises).then(snapshots => {
        const student = snapshots[0].val();
        const tf = snapshots[1].val();
        const emailRecipients = wellnessDefaultEmailRecipients.concat(tf.email);
        const mailOptions = {
          from: `${APP_NAME} <${GMAIL_EMAIL}>`,
          to: emailRecipients,
          subject: `Resolved Wellness Comment for ${student.name}`,
          text: `A wellness comment under category ${afterComment.category} has been resolved for ${student.name}. To view this comment, please visit https://tafta-pllc.firebaseapp.com/students/${afterComment.student}.\n\nThanks,\nTAFTA App`
        };
        return mailTransport.sendMail(mailOptions).then(() => {
          return console.log('New email sent');
        });
      });
    }
    else {
      return console.log("Wellness comment not resolved. No email sent.");
    }
  });

exports.sendFlaggedAcademicEmail = functions.database.ref('/comments/academic/{commentId}')
  .onCreate((snapshot) => {
    const comment = snapshot.val();
    if (!comment.attentionRequired) {
      return console.log("Attention not required. No email sent.");
    }
    const promises = [
      admin.database().ref(`students/${comment.student}`).once('value'),
      admin.database().ref(`users/${comment.createdBy}`).once('value')
    ];
    return Promise.all(promises).then(snapshots => {
      const student = snapshots[0].val();
      const tf = snapshots[1].val();
      const defaultEmailRecipients = academicLeadInstructors[comment.class] || []
      const emailRecipients = defaultEmailRecipients.concat(tf.email);
      const mailOptions = {
        from: `${APP_NAME} <${GMAIL_EMAIL}>`,
        to: emailRecipients,
        subject: `Flagged Academic Comment for ${student.name}`,
        text: `A new academic comment under category ${comment.category} has been created for ${student.name}. To view this comment, please visit https://tafta-pllc.firebaseapp.com/students/${comment.student}.\n\nThanks,\nTAFTA App`
      };
      return mailTransport.sendMail(mailOptions).then(() => {
        return console.log('New email sent');
      });
    });
  });

exports.sendResolvedAcademicEmail = functions.database.ref('/comments/academic/{commentId}')
  .onUpdate((change) => {
    const beforeComment = change.before.val();
    const afterComment = change.after.val();
    if (!afterComment.attentionRequired && beforeComment.attentionRequired) {
      const promises = [
        admin.database().ref(`students/${afterComment.student}`).once('value'),
        admin.database().ref(`users/${afterComment.createdBy}`).once('value')
      ];
      return Promise.all(promises).then(snapshots => {
        const student = snapshots[0].val();
        const tf = snapshots[1].val();
        const defaultEmailRecipients = academicLeadInstructors[afterComment.class] || []
        const emailRecipients = defaultEmailRecipients.concat(tf.email);
        const mailOptions = {
          from: `${APP_NAME} <${GMAIL_EMAIL}>`,
          to: emailRecipients,
          subject: `Resolved Academic Comment for ${student.name}`,
          text: `A academic comment under category ${afterComment.category} has been resolved for ${student.name}. To view this comment, please visit https://tafta-pllc.firebaseapp.com/students/${afterComment.student}.\n\nThanks,\nTAFTA App`
        };
        return mailTransport.sendMail(mailOptions).then(() => {
          return console.log('New email sent');
        });
      });
    }
    else {
      return console.log("Academic comment not resolved. No email sent.");
    }
  });

exports.sendNoSubmissionAcademicEmail = functions.database.ref('/comments/academic/{commentId}')
  .onCreate((snapshot) => {
    const comment = snapshot.val();
    if (comment.category !== 'No Submission') {
      return console.log("Not a 'No Submission'. No email sent.");
    }
    const promises = [
      admin.database().ref(`students/${comment.student}`).once('value'),
      admin.database().ref(`users/${comment.createdBy}`).once('value')
    ];
    return Promise.all(promises).then(snapshots => {
      const student = snapshots[0].val();
      const tf = snapshots[1].val();
      const defaultEmailRecipients = academicLeadInstructors[comment.class] || []
      const emailRecipients = defaultEmailRecipients.concat(tf.email);
      const mailOptions = {
        from: `${APP_NAME} <${GMAIL_EMAIL}>`,
        to: emailRecipients,
        subject: `No Submission for ${student.name} in ${comment.class}`,
        text: `A new academic comment under category ${comment.category} has been created for ${student.name}. To view this comment, please visit https://tafta-pllc.firebaseapp.com/students/${comment.student}.\n\nThanks,\nTAFTA App`
      };
      return mailTransport.sendMail(mailOptions).then(() => {
        return console.log('New email sent');
      });
    });
  });