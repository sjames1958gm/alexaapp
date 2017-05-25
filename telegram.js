/* eslint-disable  func-names */
/* eslint quote-props: ["error", "consistent"]*/
/**
 **/

'use strict';

const { command, checkConnection } = require('./managerIf');

const telegram_app_id = "amzn1.ask.skill.3b6b0006-cc5a-4332-bce4-b606481e576a";
const appName = "telegram";

const en = {
        translation: {
            SKILL_NAME: 'Doc viewer',
            HELP_MESSAGE: 'You can say select contact to see messages ... What can I help you with?',
            HELP_REPROMPT: 'What can I help you with?',
            STOP_MESSAGE: 'Goodbye!',
        },
    };

const telegram_strings = {
    'en': en,
    'en-US': en
};

const telegram_handlers = {
    'LaunchRequest': function() {
        if (!checkConnection(this)) return;
        const {request, session} = this.event;
        command(session.user.userId, appName, session.sessionId, 'Launch'.toLowerCase(), 
            function(status, sessionId, response, parm) {
                switch (status) {
                    case 0:
                        this.emit(':ask', `Opened telegram.`);
                    break;
                    case 1:
                        this.emit(':ask', `I don't recognize your identity, what is your username?`);
                    break;
                    default:
                        this.emit(':tell', 'Failed to open telegram');
                }
            
            }.bind(this));        
    },
    'Contact': function() {
        if (!checkConnection(this)) return;
        const {request, session} = this.event;
        const name = request.intent.name;
        const contact = request.intent.slots.Contact.value;
        command(session.user.userId, appName, session.sessionId, name.toLowerCase(), 
                contact, function(status, sessionId, response, parm) {
                switch (status) {
                    case 0:
                        this.emit(':ask', `What is your message.`);
                    break;
                    case 1:
                        this.emit(':ask', `I don't recognize your identity, what is your username?`);
                    break;
                    default:
                        this.emit(':tell', 'Failed to select contact');
                }
            
            }.bind(this));        
    },
    'Send': function() {
        if (!checkConnection(this)) return;
        const {request, session} = this.event;
        const name = request.intent.name;
        const message = request.intent.slots.Message.value;
        console.log(message);
        command(session.user.userId, appName, session.sessionId, name.toLowerCase(), 
                message ? message : "", function(status, sessionId, response, parm) {
                switch (status) {
                    case 0:
                        this.emit(':ask', `Sent.`);
                    break;
                    case 1:
                        this.emit(':ask', `I don't recognize your identity, what is your username?`);
                    break;
                    default:
                        this.emit(':tell', 'Failed to select contact');
                }
            
            }.bind(this));        
    },
    'Move': function () {
        if (!checkConnection(this)) return;
        // console.log(this.event);
        const {request, session} = this.event;
        const name = request.intent.name;
        const device = request.intent.slots.Device.value;
        if (!device) {
            var slotToElicit = 'Device';
            var speechOutput = 'Move to which device?';
            var repromptSpeech = speechOutput;
            this.emit(':elicitSlot', slotToElicit, speechOutput, repromptSpeech);
        }
        else {
            command(session.user.userId, appName, session.sessionId, name.toLowerCase(), 
                device, function(status, sessionId, response, parm) {
                    switch (status) {
                        case 0:
                            this.emit(':ask', `Moving document to ${device}`);
                        break;
                        default:
                            this.emit(':tell', 'Failed to move document');
                    }
                
                }.bind(this));
        }
    },
    'Identify': function() {
        if (!checkConnection(this)) return;
        const {request, session} = this.event;
        const name = request.intent.name;
        const user = request.intent.slots.User.value;
        console.log(`User: ${user}, ${name}`);
        command(session.user.userId, appName, session.sessionId, name.toLowerCase(), 
                user ? user.toLowerCase() : "", function(status, sessionId, response, parm) {
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
    'SessionEndedRequest': function() {
        console.log("SessionEndedRequest");
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