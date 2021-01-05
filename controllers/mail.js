const mustache = require('mustache');
const fs = require('fs');
// const path = require('path')


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

exports.sendMailsToListWithTemplate = (req, res) => {
    let successCount = 0;
    let errorCount = 0;
    let promiseList = [];

    const {list, template, subject, attachmentFile, attachmentRename} = req.body;
    const attachmentFilePath = 'mail_data/attachments/'+ attachmentFile;
    let fileName = attachmentFile;

    const htmlTemplate = fs.readFileSync('mail_data/template/'+ template +'.html',"utf-8");
    const jsonList = JSON.parse(fs.readFileSync('mail_data/list/'+ list +'.json',"utf-8"));
    const attachmentOption = JSON.parse(fs.readFileSync('mail_data/template/'+ template +'.json',"utf-8"))

    if( attachmentFile !== null || attachmentFile !== undefined ){

    }
    for(let i=0; i < jsonList.length; i++){
        if(attachmentRename){

            const variablesToReplace = req.body.attachmentRenameOptions.variablesReplace;
            const variablesToReplaceTo = req.body.attachmentRenameOptions.variablesReplaceTo;

            variablesToReplace === undefined  || variablesToReplace === null || variablesToReplaceTo === undefined  || variablesToReplaceTo === null ? res.status(500).json({message: 'variablesReplace or variablesToReplaceTo undefined' }) : null;
            !Array.isArray(variablesToReplace) || !Array.isArray(variablesToReplaceTo) ? res.status(500).json({message: 'variablesReplace or variablesToReplaceTo is not an array' }) : null;
            variablesToReplace.length === 0 || variablesToReplaceTo.length === 0 ? res.status(500).json({message: 'Invalid number of argument' }) : null;
            variablesToReplace.length !== variablesToReplaceTo.length ? res.status(500).json({message: 'You must have same amont of argument into variablesReplace and variablesReplaceTo' }) : null;

            for(let j = 0; j < variablesToReplace.length; j++){
                const prepareForReplace = '$'+variablesToReplace[j]
                fileName = fileName.replace(prepareForReplace, jsonList[i].variables[variablesToReplaceTo[j].toString()])
            }
            const tempAttachement = {
                filename: fileName,
                path: attachmentFilePath
            }

            attachmentOption.push(tempAttachement)
        }
        const output = mustache.render(htmlTemplate, jsonList[i].variables );
        promiseList.push(sendMail(jsonList[i].email, subject, output,'html', attachmentOption)
            .then( result => result === 'success' ? successCount += 1 : errorCount += 1)
            .catch( error => { console.log(error); errorCount += 1 }))
    }
    Promise.all(promiseList)
        .then(() => res.status(200).json({message: successCount + ' mails send successfully |' + errorCount + ' mails not send'}))
        .catch(error =>  console.log("Error : ", error));
}
