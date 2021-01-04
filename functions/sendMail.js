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

const sendMail = async (email, subject, content, contentType = 'text', attachmentsOption = null) => {
    let result;
    const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        // cc: 'alban.pierson@ynov.com',
        subject,
    };

    attachmentsOption !== null ? mailOptions['attachments'] = attachmentsOption : null

    switch (contentType) {
        case 'text':
            mailOptions['text'] = content;
            break;
        case 'html':
            mailOptions['html'] = content;
            break;
        default:
            console.log('erreur type non connu :' + contentType)
    }
    await transporter.sendMail(mailOptions)
        .then(() => result = 'success')
        .catch(error => result = error)
    return new Promise(function (resolve, reject) { result === 'success' ? resolve(result) : reject(result)});
}

module.exports = sendMail;
