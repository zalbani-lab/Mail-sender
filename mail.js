
require('dotenv').config();

const nodemailer = require('nodemailer');
const mustache = require('mustache');
const fs = require('fs');


// Transporter
const transporter = nodemailer.createTransport({
   service: 'gmail',
   auth: {
       user: process.env.EMAIL,
       pass: process.env.EMAIL_PASS
   },
});

const sendMail = (email, subject, cb) => {
    const html = fs.readFileSync("template/test.html","utf-8");
    const view = {test:"Coucou je viens de la variable"}
    const output = mustache.render(html, view);

    const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        cc: 'alban.pierson@ynov.com',
        subject,
        html: output,
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
