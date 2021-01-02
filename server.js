const express = require('express');

const app = express();
const PORT = 3000;
const path = require('path');

const sendMail = require('./mail.js');


// Data parsing
app.use(express.urlencoded({
    extended: false
}))
app.use(express.json());

app.post('/email', (req,res) =>{
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
})


app.get('/', (req, res)=> {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.listen(PORT, () =>{
    console.log('Server is starting on PORT' + PORT);
});
