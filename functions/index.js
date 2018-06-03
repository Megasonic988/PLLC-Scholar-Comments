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
const defaultEmailRecipients = ['weixiang@ualberta.ca'];

exports.sendFlaggedWellnessEmailEdited = functions.database.ref('/comments/wellness/{commentId}')
  .onCreate((snapshot, context) => {
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
      console.log('student', student.name);
      console.log('tf', tf.displayName);
      const emailRecipients = defaultEmailRecipients.concat(tf.email);
      const mailOptions = {
        from: `${APP_NAME} <${GMAIL_EMAIL}>`,
        to: emailRecipients,
        subject: `Flagged Wellness Comment for ${student.name}`,
        text: `Dear Cristina and ${tf.displayName.split(' ')[0]},\n\nA new wellness comment under category ${comment.category} has been created for ${student.name}. To view this comment, please visit https://tafta-pllc.firebaseapp.com/students/${student.uid}.\n\nThanks,\nTAFTA App`
      };
      return mailTransport.sendMail(mailOptions).then(() => {
        return console.log('New email sent');
      });
    });
  });