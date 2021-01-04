const mustache = require('mustache');
const fs = require('fs');

const sendMail = require('../functions/sendMail');

exports.sendOneMail = (req, res) => {
    const {email, subject, text} = req.body;
    sendMail(email, subject, text)
        .then( result => {
            if (result === 'success') {
                res.status(200).json({message: 'Mail send successfully !'})
            } else {
                res.status(500).json({message: 'Error mail not send : ' + result})
            }
        })
        .catch( error => res.status(500).json({message: 'Error in sendOneMail function : ' + error}))

};

exports.sendOneMailTemplate = (req, res) => {
    const {email, subject, template, variables} = req.body;
    if(template !== undefined && variables !== undefined){
        const htmlTemplate = fs.readFileSync('template/'+ template +'.html',"utf-8");
        const output = mustache.render(htmlTemplate, variables);

        sendMail(email, subject, output,'html')
            .then( result => {
                if (result === 'success') {
                    res.status(200).json({message: 'Mail send successfully !'})
                } else {
                    res.status(500).json({message: 'Error mail not send : ' + result})
                }
            })
            .catch( error => res.status(500).json({message: 'Error in sendOneMailTemplate function : ' + error}))
    }else{
        res.status(500).json({ message: "Template or variables undefined " })
    }

}
