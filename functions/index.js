const functions = require('firebase-functions');
const nodemailer = require('nodemailer');
const admin = require('firebase-admin');
const cors = require('cors')({origin: 'https://kannadakali.github.io'});
//THIS IS THE ISSUE!!! PUSH TO GIT/FIREBASE?!?!?!?!

admin.initializeApp();

exports.sendEmail = functions.https.onRequest((req, res) => {
  cors(req, res, () => {
    if (req.method !== 'POST') {
      return res.status(405).send('Method Not Allowed');
    }

    const { userName, audioData } = req.body; // audioData should be a base64 encoded string

    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: 'pranav.gunhal@gmail.com',
        pass: 'cewmtzenejkimgik',
      },
    });

    const mailOptions = {
      from: 'pranav.gunhal@gmail.com',
      to: 'pranav.gunhal@gmail.com',
      subject: 'Quiz Submission',
      text: `User: ${userName} submitted the quiz.`,
      attachments: [
        {   
          filename: 'audio-recording.mp3',
          content: new Buffer.from(audioData, 'base64'),
          contentType: 'audio/mpeg'
        }
      ]
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(error);
        return res.status(500).send('Error sending email');
      }
      return res.status(200).send('Email sent successfully');
    });
  });
});
