/* eslint-disable operator-linebreak */
/*
 *
 *
 ------->Title: Notification file
 ->Description: this is to send sms through twilio to user
 ------>Author: Shawon Talukder
 -------->Date: 11/07/2022
 *
 *
 */
// Dependencies
const https = require('https');
const querystring = require('node:querystring');
const environment = require('./environments');

// Model Scaffolding
const notifications = {};

// Model Structure
notifications.twilioSend = (phone, msg, callback) => {
    const userPhone =
        typeof phone === 'string' && phone.trim().length === 11 ? phone.trim() : false;
    const userMsg =
        typeof msg === 'string' && msg.trim().length > 0 && msg.trim().length <= 1600
            ? msg.trim()
            : false;
    if (userMsg && userPhone) {
        // create a payload with parameters
        const payload = {
            From: environment.twilio.fromPhone,
            To: '+8801521400308',
            Body: userMsg,
        };
        const strPayload = querystring.stringify(payload);

        // twilio configurations
        const requestProperties = {
            hostname: 'api.twilio.com',
            method: 'POST',
            path: `/2010-04-01/Accounts/${environment.twilio.accountSid}/Messages.json`,
            auth: `${environment.twilio.accountSid}:${environment.twilio.authToken}`,
            headers: {
                'content-type': 'application/x-www-form-urlencoded',
            },
        };

        // constantiate the request
        const req = https.request(requestProperties, (res) => {
            // get the status code
            const status = res.statusCode;

            // this will give error only its getting other codes than 200, 201
            if (status === 200 || status === 201) {
                callback(false);
            } else {
                callback(`status code returned was ${status}`);
            }
        });

        // this error is to check network error
        req.on('error', (error) => {
            callback(error);
        });

        req.write(strPayload);
        req.end();
    } else {
        callback('phone or msg invalid!');
    }
};
// Export Model
module.exports = notifications;
