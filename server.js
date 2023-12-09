const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');

const app = express();
const port = process.env.PORT || 3000;

// Middleware for parsing JSON and form data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Define an API endpoint for sending emails
app.post('/send-email', (req, res) => {
  // Get email data from the request body
  const { userName, score /* Add other form fields here */ } = req.body; // Include the 'score' field

  // Create a Nodemailer transporter
  const transporter = nodemailer.createTransport({
    service: 'Gmail', // Use your email service provider
    auth: {
      user: 'pranav.gunhal@gmail.com', // Your email address
      pass: 'cewmtzenejkimgik', // Your email password
    },
  });

  // Email message options
  const mailOptions = {
    from: 'pranav.gunhal@gmail.com', // Sender's email address
    to: 'pranav.gunhal@gmail.com', // Recipient's email address
    subject: 'Quiz Submission', // Subject of the email
    text: `User: ${userName} submitted the quiz with a score of ${score}.`, // Include the score in the email body
  };

  // Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
      res.status(500).json({ error: 'Email could not be sent.' });
    } else {
      console.log('Email sent: ' + info.response);
      res.json({ message: 'Email sent successfully.' });
    }
  });
});

// Serve your static files (HTML, CSS, JavaScript)
app.use(express.static(__dirname));

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
