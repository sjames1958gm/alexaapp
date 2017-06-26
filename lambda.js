
'use strict';

const Alexa = require('alexa-sdk');

var {nzos_handlers, nzos_app_id, nzos_strings} = require("./nzos");

var latencyAppId = "amzn1.ask.skill.43994ac0-16d2-4804-8dd1-2beba59fba43";
var videoAppId = "amzn1.ask.skill.c8e79877-8278-4628-8076-4b7ed6b8bfef";
var presentationsAppId = "amzn1.ask.skill.bcaf523d-4c04-450f-9f6b-20c40c5ec1d8";
var telegramAppId = "amzn1.ask.skill.3b6b0006-cc5a-4332-bce4-b606481e576a";
var browserAppId = "amzn1.ask.skill.a24e5097-1cdb-4c09-aeba-c96116512998";
var appId2048 = "amzn1.ask.skill.7a5a1ba6-0fe8-435f-ae9a-87bd9c02ac7d";
var helloWorldAppId = "amzn1.ask.skill.85ab5cb0-b6d3-416a-b175-805c5655f4c7";

exports.handler = function (event, context) {
    const alexa = Alexa.handler(event, context);
    let app = "";
    
    switch (event.session.application.applicationId) {
        // case presentationsAppId:
        //     app = "presentations";
        //     alexa.appId = presentationsAppId;
        //     alexa.resources = presentations_strings;
        //     alexa.registerHandlers(presentations_handlers);
        // break;
        case presentationsAppId:
            app = "presentations";
            alexa.appId = presentationsAppId;
            alexa.resources = nzos_strings;
            alexa.registerHandlers(nzos_handlers);
            context.appName = "presentations";
        break;
        case nzos_app_id:
            app = "cloud OS";
            alexa.appId = nzos_app_id;
            alexa.resources = nzos_strings;
            alexa.registerHandlers(nzos_handlers);
        break;
        case telegramAppId:
            app = "telegram";
            alexa.appId = telegramAppId;
            alexa.resources = nzos_strings;
            alexa.registerHandlers(nzos_handlers);
            context.appName = "telegram";
        break;
        case latencyAppId:
            app = "Test App";
            alexa.appId = latencyAppId;
            alexa.resources = nzos_strings;
            alexa.registerHandlers(nzos_handlers);
            context.appName = "latency";
        break;
        case videoAppId:
            app = "Video";
            alexa.appId = videoAppId;
            alexa.resources = nzos_strings;
            alexa.registerHandlers(nzos_handlers);
            context.appName = "video";
            context.appPrompt = "video app";
        break;
        case browserAppId:
            app = "Browser";
            alexa.appId = browserAppId;
            alexa.resources = nzos_strings;
            alexa.registerHandlers(nzos_handlers);
            context.appName = "browser";
            context.appPrompt = "browser";
        break;
        case appId2048:
            app = "Twenty fortyeight";
            alexa.appId = appId2048;
            alexa.resources = nzos_strings;
            alexa.registerHandlers(nzos_handlers);
            context.appName = "and2048";
            context.appPrompt = "Twenty fortyeight";
        break;
        case helloWorldAppId:
            app = "Hello World";
            alexa.appId = helloWorldAppId;
            alexa.resources = nzos_strings;
            alexa.registerHandlers(nzos_handlers);
            context.appName = "helloworld";
            context.appPrompt = "Hello World";
        break;
        default:
            return;
    }

    const { request } = event;
    console.log(request);
    console.log(`${new Date().toTimeString()}: skill ${app}`);
    console.log(`\tRequest type: ${request.type}`);
    if (request.type == 'IntentRequest') {
        let { intent } = request;
        let str = `\tIntent: ${intent.name} (`;
        if (intent.slots) {
            str += Object.keys(intent.slots).map((k) => (
                        `${k}: ${intent.slots[k].value}`
                    )).join(", ");
        }
        str += `)`;
        console.log(str);
    }

    alexa.execute();
};
