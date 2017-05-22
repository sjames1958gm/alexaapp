/* eslint-disable  func-names */
/* eslint quote-props: ["error", "consistent"]*/
/**
 **/

'use strict';

const { command } = require('./managerIf');

const nzos_app_id = "amzn1.ask.skill.d59e4dcf-92b7-4c4f-9ecc-ec93623a4d17";
const appName = "nzos";

const en = {
        translation: {
            SKILL_NAME: 'Doc viewer',
            HELP_MESSAGE: 'You can say open application or you can say exit ... What can I help you with?',
            HELP_REPROMPT: 'What can I help you with?',
            STOP_MESSAGE: 'Goodbye!',
        },
    };

const nzos_strings = {
    'en': en,
    'en-US': en
};

const nzos_handlers = {
    'Launch': function () {
        // console.log(this.event);
        const {request, session, context} = this.event;
        const name = request.intent.name;
        const app = request.intent.slots.App.value;
        let device = request.intent.slots.Device.value;
        if (!app) {
            var slotToElicit = 'App';
            var speechOutput = 'Which app would you like to start?';
            var repromptSpeech = speechOutput;
            this.emit(':elicitSlot', slotToElicit, speechOutput, repromptSpeech);
        }
        else {
            if (!device) {
                device = "default device";
            }
            command(context.System.user.userId, appName, session.sessionId, name.toLowerCase(), 
                app, device, function(status, sessionId, response, parm) {
                    switch (status) {
                        case 0:
                            this.emit(':tell', `Launching ${app} on ${device}`);
                        break;
                        case 1:
                            this.emit(':ask', `I don't recognize your identity, what is your username?`);
                        break;
                        default:
                            this.emit(':tell', 'Failed to launch app');
                    }
                
                }.bind(this)); 
        }
    },
    'Identify': function() {
        const {request, session, context} = this.event;
        const name = request.intent.name;
        const user = request.intent.slots.User.value;
        console.log(`User: ${user}, ${name}`);
        command(context.System.user.userId, appName, session.sessionId, name.toLowerCase(), 
                user.toLowerCase(), function(status, sessionId, response, parm) {
                    switch(status) {
                        case 0:
                            this.emit(':ask', `User identity confirmed. Repeat your original request`);
                        break;
                        case 1:
                            this.emit(':ask', `I don't recognize your identity, what is your username?`);
                        break;
                        default:
                            this.emit(':tell', 'Failed to complete request');
                    }
                
                }.bind(this));
    },
    'AMAZON.HelpIntent': function () {
        const speechOutput = this.t('HELP_MESSAGE');
        const reprompt = this.t('HELP_MESSAGE');
        this.emit(':ask', speechOutput, reprompt);
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', this.t('STOP_MESSAGE'));
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', this.t('STOP_MESSAGE'));
    },
};

module.exports = {nzos_app_id, nzos_handlers, nzos_strings};