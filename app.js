require('dotenv').config();
const express = require('express');
const cors = require('cors');

const mailRoutes = require('./routes/mail');


const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/mail', mailRoutes);

module.exports = app;
