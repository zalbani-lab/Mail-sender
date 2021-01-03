const mustache = require('mustache');
const fs = require('fs');

const sendMail = require('../functions/sendMail');

exports.sendOneMail = (req, res) => {
    const {email, subject, text} = req.body;
    sendMail(email, subject, text, res)
};

exports.sendOneMailTemplate = (req, res) => {
    const {email, subject} = req.body;
    if(req.body.template != undefined){
        const templateName = req.body.template
        const html = fs.readFileSync('template/'+ templateName +'.html',"utf-8");
        const view = {test:"Coucou je viens de la variable"}
        const output = mustache.render(html, view);

        sendMail(email, subject, output, res,'html')
    }else{
        res.status(500).json({ message: "Variable : template undefined " })
    }

}
