require('dotenv').config();

const nodemailer = require('nodemailer');

// Transporter
const transporter = nodemailer.createTransport({
   service: 'gmail',
   auth: {
       user: process.env.EMAIL,
       pass: process.env.EMAIL_PASS
   },
});

const sendMail = (email, subject, content, res, contentType = 'text') => {

    const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        cc: 'alban.pierson@ynov.com',
        subject,
    };

    switch (contentType){
        case 'text':  mailOptions['text'] = content; break;
        case 'html':  mailOptions['html'] = content; break;
        default: console.log('erreur type non connu :' + contentType)
    }

    transporter.sendMail(mailOptions)
        .then(res.status(200).json({ message: 'Mail send successfully !'}))
        .catch(error => res.status(500).json({ message: error}))
}

module.exports = sendMail;
