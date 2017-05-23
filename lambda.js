
'use strict';

const Alexa = require('alexa-sdk');
var { connected } = require('./managerIf');

var {presentation_handlers, presentation_app_id, presentation_strings} = require("./presentation");
var {nzos_handlers, nzos_app_id, nzos_strings} = require("./nzos");
var {telegram_handlers, telegram_app_id, telegram_strings} = require("./telegram");

exports.handler = function (event, context) {
    const alexa = Alexa.handler(event, context);
    
    switch (event.session.application.applicationId) {
        case presentation_app_id:
            console.log('' + new Date().toTimeString() + ': launch presentation skill');
            alexa.appId = presentation_app_id;
            alexa.resources = presentation_strings;
            alexa.registerHandlers(presentation_handlers);
        break;
        case nzos_app_id:
            console.log('' + new Date().toTimeString() + ': launch nzos (cloud apps) skill');
            alexa.appId = nzos_app_id;
            alexa.resources = nzos_strings;
            alexa.registerHandlers(nzos_handlers);
        break;
        case telegram_app_id:
            console.log('' + new Date().toTimeString() + ': launch telegram skill');
            alexa.appId = telegram_app_id;
            alexa.resources = telegram_strings;
            alexa.registerHandlers(telegram_handlers);
        break;
    }

    alexa.execute();
};