
'use strict';

const Alexa = require('alexa-sdk');
var { connected } = require('./managerIf');

var {presentations_handlers, presentations_app_id, presentations_strings} = require("./presentations");
var {nzos_handlers, nzos_app_id, nzos_strings} = require("./nzos");
var {telegram_handlers, telegram_app_id, telegram_strings} = require("./telegram");

exports.handler = function (event, context) {
    const alexa = Alexa.handler(event, context);
    let app = "";
    
    switch (event.session.application.applicationId) {
        case presentations_app_id:
            app = "presentations";
            alexa.appId = presentations_app_id;
            alexa.resources = presentations_strings;
            alexa.registerHandlers(presentations_handlers);
        break;
        case nzos_app_id:
            app = "cloud OS";
            alexa.appId = nzos_app_id;
            alexa.resources = nzos_strings;
            alexa.registerHandlers(nzos_handlers);
        break;
        case telegram_app_id:
            app = "telegram";
            alexa.appId = telegram_app_id;
            alexa.resources = telegram_strings;
            alexa.registerHandlers(telegram_handlers);
        break;
    }

    console.log(`${new Date().toTimeString()}: launch ${app} skill`);
    console.log(`Request type: ${event.request.type}`);

    alexa.execute();
};