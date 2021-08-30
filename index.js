const serverless = require('serverless-http');
const express = require('express');
const app = express();
const expressLayouts = require('express-ejs-layouts');

app.set('view engine', 'ejs');
app.use(expressLayouts);

app.use(express.static('assets'));
app.use(express.urlencoded({ extended: true }));

app.use('/', require('./routes/index'));
const serverlessHandler = serverless(app);

// This bypasses the issue where Serverless sends null on req.url when route is '/'
async function handler(event, context) {
  event.path = event.path === '' ? '/' : event.path;

  const result = await serverlessHandler(event, context);

  return result;
}

module.exports.handler = handler;
