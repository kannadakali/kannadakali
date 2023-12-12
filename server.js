const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/send-email', upload.single('audioData'), (req, res) => {
    const { userName } = req.body;
    const audioFilePath = req.file.path; // The path to the uploaded audio file

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
                filename: req.file.originalname,
                path: audioFilePath
            }
        ]
    };

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

app.use(express.static(__dirname));

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
