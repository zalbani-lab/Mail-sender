
require('dotenv').config();

const nodemailer = require('nodemailer');

const auth ={
    auth:{
        api_key:'',
        domain:''
    }
}


// Transporter
const transporter = nodemailer.createTransport({
   service: 'gmail',
   auth: {
       user: process.env.EMAIL,
       pass: process.env.EMAIL_PASS
   },
});

const sendMail = (email, subject, text, cb) => {
    const mailOptions = {
        from: email,
        to: process.env.EMAIL,
        cc: 'alban.pierson@ynov.com',
        subject,
        text,
        attachments:[
            { filename: 'picture.png', path: './picture.png'}
        ]
    };

    transporter.sendMail(mailOptions, function (err, data){
        if(err) {
            cb(err, null);
        }else{
            cb(null, data);
        }
    })
}

module.exports = sendMail;
