/* eslint-disable  func-names */
/* eslint quote-props: ["error", "consistent"]*/
/**
 **/

'use strict';

const { command } = require('./managerIf');

const telegram_app_id = "amzn1.ask.skill.3b6b0006-cc5a-4332-bce4-b606481e576a";
const appName = "nzos";

const en = {
        translation: {
            SKILL_NAME: 'Doc viewer',
            HELP_MESSAGE: 'You can say open application or you can say exit ... What can I help you with?',
            HELP_REPROMPT: 'What can I help you with?',
            STOP_MESSAGE: 'Goodbye!',
        },
    };

const telegram_strings = {
    'en': en,
    'en-US': en
};

const telegram_handlers = {
    'test': function () {
        console.log(this.event);
        const {request, session, context} = this.event;
        const name = request.intent.name;
        // const app = request.intent.slots.App.value;
        // let device = request.intent.slots.Device.value;
        command(session.user.userId, addName, session.sessionId, name.toLowerCase(), 
            function(status, sessionId, response, parm) {
                switch (status) {
                    case 0:
                        this.emit(':tell', `Test complete`);
                    break;
                    case 1:
                        this.emit(':ask', `I don't recognize your identity, what is your username?`);
                    break;
                    default:
                        this.emit(':tell', 'Test failed');
                }
            
            }.bind(this));
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

module.exports = {telegram_app_id, telegram_handlers, telegram_strings};