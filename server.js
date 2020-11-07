const express = require('express');

const app = express();
const PORT = 3008;
const path = require('path');

const sendMail = require('./mail.js');


// Data parsing
app.use(express.urlencoded({
    extended: false
}))
app.use(express.json());

app.post('/email', (req,res) =>{
    console.log('Data :', req.body)
    const {email, subject, text} = req.body;
    sendMail(email, subject, text, function (err, data){
        if(err){
            res.status(500).json({ message: 'Internal Error'});
        } else{
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
