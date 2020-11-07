require('dotenv').config();

const nodemailer = require('nodemailer');

// Transporter
let transporter = nodemailer.createTransport({
   service: 'gmail',
   auth: {
       user: process.env.EMAIL,
       pass: process.env.EMAIL_PASS
   },
});


let mailOptions = {
    from: 'pro.pierson.alban@gmail.com',
    to: 'pierson.alban@hotmail.fr',
    cc: 'alban.pierson@ynov.com',
    subject: 'Testing',
    Text: 'IT works'
};

transporter.sendMail(mailOptions, function (err, data){
    if(err) {
        console.log(err);
    }else{
        console.log('email envoyé')
    }
})
