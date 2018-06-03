const functions = require('firebase-functions');
const admin = require('firebase-admin');
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

const APP_NAME = 'Teaching Assistants for Teaching Assistants (TAFTA) App - PLLC';

exports.sendFlaggedWellnessEmail = functions.database.ref('/comments/wellness/')
  .onCreate((snapshot, context) => {
    const comment = snapshot.val();
    const mailOptions = {
      from: `${APP_NAME} <${GMAIL_EMAIL}>`,
      to: 'weixiang@ualberta.ca'
    };
    mailOptions.subject = "hello there";
    mailOptions.text = "why hello there..!!";
    return mailTransport.sendMail(mailOptions).then(() => {
      return console.log('New email sent');
    });
  });