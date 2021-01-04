const mustache = require('mustache');
const fs = require('fs');

const sendMail = require('../functions/sendMail');

exports.sendOneMail = (req, res) => {
    const {email, subject, text} = req.body;
    sendMail(email, subject, text)
        .then( result => result === 'success' ? res.status(200).json({message: 'Mail send successfully !'}) : res.status(500).json({message: 'Error mail not send : ' + result}))
        .catch( error => res.status(500).json({message: 'Error in sendOneMail function : ' + error}))

};

exports.sendOneMailTemplate = (req, res) => {
    const {email, subject, template, variables} = req.body;
    if(template !== undefined && variables !== undefined){
        const htmlTemplate = fs.readFileSync('mail_data/template/'+ template +'.html',"utf-8");
        const output = mustache.render(htmlTemplate, variables);

        sendMail(email, subject, output,'html')
            .then( result => result === 'success' ? res.status(200).json({message: 'Mail send successfully !'}) : res.status(500).json({message: 'Error mail not send : ' + result}))
            .catch( error => res.status(500).json({message: 'Error in sendOneMailTemplate function : ' + error}))
    }else{
        res.status(500).json({ message: "Body not admissible" })
    }
}

exports.sendMailsToList = (req, res) => {
    let successCount = 0;
    let errorCount = 0;
    let promiseList = [];

    const {list, subject, text} = req.body;
    if(list !== undefined && subject !== undefined && text !== undefined) {
        const rawData = fs.readFileSync('mail_data/list/' + list + '.json', "utf-8");
        const jsonList = JSON.parse(rawData);

        for (let i = 0; i < jsonList.length; i++) {
            promiseList.push(sendMail(jsonList[i].email, subject, text)
                .then(result => result === 'success' ? successCount += 1 : errorCount += 1)
                .catch(error => {
                    console.log(error);
                    errorCount += 1
                }))
        }
        Promise.all(promiseList)
            .then(() => res.status(200).json({message: successCount + ' mails send successfully |' + errorCount + ' mails not send'}))
            .catch(error => console.log("Error : ", error));
    }else{
        res.status(500).json({ message: "Body not admissible" })
    }
}
