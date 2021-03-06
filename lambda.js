'use strict';

const Alexa = require('alexa-sdk');

const {
  startClient
} = require('./managerIf');

const {
  getUserRunningData,
  getVoiceAppData
} = require('./db');

const {
  nzos_handlers,
  nzos_app_id,
  nzos_strings
} = require("./nzos");

const getUserFromToken = function(token) {
  console.log(`getUserFromToken ${token}`);
  let magic = "nzos-";
  if (token.indexOf(magic) == 0) {
    return token.substr(magic.length);
  }
  return "";
};

const errStr = 'The skill is unavailable at this time, please try again, later.';

exports.handler = function(event, context) {

  console.log(`New Request: -----------------------------------------`);

  console.log(`ID: ${event.session.application.applicationId}`);
  const alexa = Alexa.handler(event, context);

  const token = event.session.user.accessToken;

  if (token) {
    let user = getUserFromToken(token);
    if (!user) {
      console.log(`Invalid user token: ${token}`);
      alexa.emit(':tell', 'Application is not available at this time');
      return;
    }

    if (process.env.MGR_IP) {
      startClient(process.env.MGR_IP, process.env.MGR_PORT, (error, handle) => {
        if (error) {
          alexa.emit(':tell', errStr);
          return;
        }

        context.handle = handle;
        start(alexa, event, context, handle);

      });
    }
    else {

      getUserRunningData(user, (err, runningDataConfig) => {
        if (err) {
          console.log(err);
          alexa.emit(':tell', 'Application is not available at this time');
        }

        if (runningDataConfig.hasOwnProperty("IP") && runningDataConfig.hasOwnProperty("APIPORT")) {
          console.log(`User location retrieved from S3 ${runningDataConfig.IP}:${runningDataConfig.APIPORT}`);

          startClient(runningDataConfig.IP, runningDataConfig.APIPORT, (error, handle) => {
            if (error) {
              alexa.emit(':tell', errStr);
              return;
            }

            context.handle = handle;
            start(alexa, event, context);
          });

        }
        else {
          alexa.emit(':tell', 'Application is not available at this time');
        }
      });
    }

  }
  else {
    alexa.emit(':tell', 'Application is not available at this time');
  }


};

function start(alexa, event, context) {

  let applicationId = event.session.application.applicationId;

  if (applicationId == nzos_app_id) {
    alexa.appId = nzos_app_id;
    alexa.resources = nzos_strings;
    alexa.registerHandlers(nzos_handlers);
    execute(alexa, event, context, "cloud OS");
    return;
  }

  getVoiceAppData(event.session.application.applicationId, (err, appData) => {
    if (err) {
      console.log(err);
      alexa.emit(':tell', 'Application is not available');
      return;
    }

    let appName = appData.appName;

    context.appName = appName;
    context.appPrompt = appData.appPrompt;
    alexa.appId = applicationId;
    alexa.resources = nzos_strings;
    alexa.registerHandlers(nzos_handlers);

    execute(alexa, event, context, appName);
  });
}

function execute(alexa, event, context, appName) {

  const {
    request
  } = event;

  console.log(request);
  console.log(`${new Date().toTimeString()}: skill ${appName}`);
  console.log(`\tRequest type: ${request.type}`);

  if (request.type == 'IntentRequest') {
    let {
      intent
    } = request;
    
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
