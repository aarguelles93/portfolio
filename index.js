const serverless = require('serverless-http');
const express = require('express')
const app = express()

app.use('/', require('./routes/index'))


module.exports.handler = serverless(app);