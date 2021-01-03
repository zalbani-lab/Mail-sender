const sendMail = require('../functions/sendMail');

exports.sendOneMail = (req, res) => {
    const {email, subject} = req.body;
    sendMail(email, subject, function (err, data){
        if(err){
            console.log('Fail, email not send :', req.body)
            console.log(err)
            res.status(500).json({ message: 'Internal Error'});
        } else{
            console.log('Email send successfully :', req.body)
            res.json({ message: 'email sent'});
        }
    });
};
