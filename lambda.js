
'use strict';

const Alexa = require('alexa-sdk');
const AWS = require('aws-sdk');
const s3 = new AWS.S3();

var {nzos_handlers, nzos_app_id, nzos_strings} = require("./nzos");

exports.handler = function (event, context) {
    console.log(`ID: ${event.session.application.applicationId}`);
    const alexa = Alexa.handler(event, context);
        
    let applicationId = event.session.application.applicationId;
    
    if (applicationId == nzos_app_id) {
        alexa.appId = nzos_app_id;
        alexa.resources = nzos_strings;
        alexa.registerHandlers(nzos_handlers);        
        execute(alexa, event, context, "cloud OS");
        return;
    }
    
    let params = {
        Bucket: "AlexaApps",
        Key: event.session.application.applicationId
    };

    s3.getObject(params, function(err, data) {
        
        if (err) {
            console.log(`Error from S3: ${err}`);
            alexa.emit(':tell', 'Application is not available');
            return ;
        }

        console.log(data.Body.toString('utf8'));
        var appData = JSON.parse(data.Body.toString('utf8'));
        console.log(appData);

        let appName = appData.appName;
        
        context.appName = appName;
        context.appPrompt = appData.appPrompt;
        alexa.appId = applicationId;
        alexa.resources = nzos_strings;
        alexa.registerHandlers(nzos_handlers);        
        
        execute(alexa, event, context, appName);

    });
};

function execute(alexa, event, context, appName) {
    
    const { request } = event;
    
    console.log(request);
    console.log(`${new Date().toTimeString()}: skill ${appName}`);
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
}
