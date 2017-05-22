/* eslint-disable  func-names */
/* eslint quote-props: ["error", "consistent"]*/
/**
 **/

'use strict';

const { command } = require('./managerIf');

const presentation_app_id = "amzn1.ask.skill.bcaf523d-4c04-450f-9f6b-20c40c5ec1d8";
const appName = "pdf";

const en = {
        translation: {
            SKILL_NAME: 'Doc viewer',
            HELP_MESSAGE: 'You can say open document or you can say exit ... What can I help you with?',
            HELP_REPROMPT: 'What can I help you with?',
            STOP_MESSAGE: 'Goodbye!',
        },
    };

const presentation_strings = {
    'en': en,
    'en-US': en
};

const presentation_handlers = {
    'Show': function () {
        // console.log(this.event);
        const {request, session, context} = this.event;
        const name = request.intent.name;
        const document = request.intent.slots.Document.value;
        let device = request.intent.slots.Device.value;
        if (!document) {
            var slotToElicit = 'Document';
            var speechOutput = 'Which document would you like to open?';
            var repromptSpeech = speechOutput;
            this.emit(':elicitSlot', slotToElicit, speechOutput, repromptSpeech);
        }
        else {
            if (!device) {
                device = "default device";
            }
            command(context.System.user.userId, appName, session.sessionId, name.toLowerCase(), 
                document, device, function(status, sessionId, response, parm) {
                    switch (status) {
                        case 0:
                            this.emit(':ask', `Opening document ${document} on ${device}`);
                        break;
                        case 1:
                            this.emit(':ask', `I don't recognize your identity, what is your username?`);
                        break;
                        default:
                            this.emit(':tell', 'Failed to open document');
                    }
                
                }.bind(this));
        }
    },
    'Move': function () {
        // console.log(this.event);
        const {request, session, context} = this.event;
        const name = request.intent.name;
        const device = request.intent.slots.Device.value;
        if (!device) {
            var slotToElicit = 'Device';
            var speechOutput = 'Move to which device?';
            var repromptSpeech = speechOutput;
            this.emit(':elicitSlot', slotToElicit, speechOutput, repromptSpeech);
        }
        else {
            command(context.System.user.userId, appName, session.sessionId, name.toLowerCase(), 
                device, function(status, sessionId, response, parm) {
                    console.log(`here ${status} ${sessionId} ${response} ${parm}`);
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
    'Page': function () {
        // console.log(this.event);
        const {request, session, context} = this.event;
        const name = request.intent.name;
        const direction = request.intent.slots.Direction.value;
        if (!direction) {
            var slotToElicit = 'Direction';
            var speechOutput = 'Page in which direction?';
            var repromptSpeech = speechOutput;
            this.emit(':elicitSlot', slotToElicit, speechOutput, repromptSpeech);
        }
        else {
            command(context.System.user.userId, appName, session.sessionId, name.toLowerCase(), 
                direction, function(status, sessionId, response, parm) {
                    console.log(`here ${status} ${sessionId} ${response} ${parm}`);
                    switch (status) {
                        case 0:
                            this.emit(':ask', `Paging ${direction}`);
                        break;
                        default:
                            this.emit(':tell', 'Failed to complete request');
                    }
                
                }.bind(this));
        }
    },
    'Scroll': function () {
        // console.log(this.event);
        const {request, session, context} = this.event;
        const name = request.intent.name;
        const direction = request.intent.slots.Direction.value;
        if (!direction) {
            var slotToElicit = 'Direction';
            var speechOutput = 'Which direction to scroll?';
            var repromptSpeech = speechOutput;
            this.emit(':elicitSlot', slotToElicit, speechOutput, repromptSpeech);
        }
        else {
            command(context.System.user.userId, appName, session.sessionId, name.toLowerCase(), 
                direction, function(status, sessionId, response, parm) {
                    console.log(`here ${status} ${sessionId} ${response} ${parm}`);
                    switch (status) {
                        case 0:
                            this.emit(':ask', `Scrolling ${direction}`);
                        break;
                        default:
                            this.emit(':tell', 'Failed to complete request');
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

module.exports = {presentation_app_id, presentation_handlers, presentation_strings};