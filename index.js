'use strict';

const express = require("express");
const http = require("http");
const bodyParser = require('body-parser');
const context = require('aws-lambda-mock-context');
const Alexa = require('alexa-sdk');

require('dotenv').config();

var PORT = process.env.PORT || 8080;

// lambda.js contains the lambda function for Alexa as in https://github.com/alexa/alexa-skills-kit-sdk-for-nodejs
var   lambda = require('./lambda');

const app = express();

app.use(bodyParser.json({ type: 'application/json' }));

// your service will be available on <YOUR_IP>/alexa
app.post('/alexa/', function (req, res) {
    var ctx = context();
    lambda.handler(req.body,ctx);
    ctx.Promise
        .then(resp => {  return res.status(200).json(resp); })
        .catch(err => {  console.log(err); }) //add your error handling stuff 
});

const httpServer = http.createServer(app);

httpServer.listen(PORT, '0.0.0.0', function () {
    console.log(`Alexa skill running on ${PORT}`);
});
