const serverless = require('serverless-http');
const express = require('express')
const app = express()


app.get('/helloworld', async (req, res) => {
  await res.send("Hello world!");
})


module.exports.handler = serverless(app);