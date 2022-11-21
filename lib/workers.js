/* eslint-disable operator-linebreak */
/*
 *
 *
 ------->Title: Workers file
 ->Description: This is the workers file for "Uptime monitoring app"
 ------>Author: Shawon Talukder
 -------->Date: 11/21/2022
 *
 *
 */

// dependencies
const url = require('url');
const http = require('http');
const https = require('https');
const datalib = require('./data');
const { parseJSON } = require('../helpers/utilities');
const { twilioSend } = require('../helpers/notifications');

// app object - module scaffoling
const workers = {};

// get all checks function
workers.getAllChecks = () => {
    // grab all checks from the check directory
    datalib.list('checks', (err1, checks) => {
        if (!err1 && checks && checks.length > 0) {
            checks.forEach((check) => {
                datalib.read('checks', check, (err2, indiCheckData) => {
                    if (!err2 && indiCheckData) {
                        // validate the checkdata
                        workers.validateCheckData(parseJSON(indiCheckData));
                    } else {
                        console.log("Error: can't read the checkdata for each");
                    }
                });
            });
        } else {
            console.log('Error: There is no check in the directory.');
        }
    });
};

// validate individual check data and return something
workers.validateCheckData = (originalCheckData) => {
    if (originalCheckData && originalCheckData.checkId) {
        const originalData = originalCheckData;
        originalData.state =
            typeof originalCheckData.state === 'string' &&
            ['up', 'down'].indexOf(originalCheckData.state) > -1
                ? originalCheckData.state
                : 'down';
        originalData.lastChecked =
            typeof originalCheckData.lastChecked === 'number' && originalCheckData.lastChecked > 0
                ? originalCheckData.lastChecked
                : false;

        workers.performCheck(originalData);
    } else {
        console.log('Error: Invalid check or interupted check file');
    }
};

// perform check
workers.performCheck = (originalData) => {
    // create a checkoutcome object to assign value
    let checkOutcome = {};

    let outcomeSent = false;
    // parse the hostname and full url from original data
    const parsedUrl = url.parse(`${originalData.protocol}://${originalData.url}`);
    const hostName = parsedUrl.hostname;
    const { path } = parsedUrl;

    // construct the properties for request
    const requestProps = {
        protocol: `${originalData.protocol}:`,
        hostname: hostName,
        method: originalData.method.toUpperCase(),
        path,
        timeout: originalData.timeOutSec * 1000,
    };
    const protocolToUse = originalData.protocol === 'http' ? http : https;

    const req = protocolToUse.request(requestProps, (res) => {
        // get the status code
        const status = res.statusCode;
        checkOutcome.responseCode = status;

        // update the check outcome and pass to the next process
        if (!outcomeSent) {
            workers.processCheckOutcome(originalData, checkOutcome);
            outcomeSent = true;
        }
    });

    req.on('error', (err) => {
        checkOutcome = {
            error: true,
            value: err,
        };
        if (!outcomeSent) {
            workers.processCheckOutcome(originalData, checkOutcome);
            outcomeSent = true;
        }
    });

    req.on('timeout', () => {
        checkOutcome = {
            error: true,
            value: 'timeout',
        };
        if (!outcomeSent) {
            workers.processCheckOutcome(originalData, checkOutcome);
            outcomeSent = true;
        }
    });

    // end the response
    req.end();
};
// perform checkoutcome
workers.processCheckOutcome = (originalData, checkOutcome) => {
    const state =
        !checkOutcome.error &&
        checkOutcome.responseCode &&
        originalData.successCodes.indexOf(checkOutcome.responseCode) > -1
            ? 'up'
            : 'down';

    // decide whether we should alert the user or not
    const alertWanted = !!(originalData.lastChecked && originalData.state !== state);

    // update check data
    const newCheckData = originalData;

    newCheckData.state = state;
    newCheckData.lastChecked = Date.now();

    // update the check in db
    datalib.update('checks', originalData.checkId, newCheckData, (err) => {
        if (!err) {
            // pass to next functions to send alert
            if (alertWanted) {
                workers.alertUserStatusChange(newCheckData);
            } else {
                console.log('Message: Alert is not needed.');
            }
        } else {
            console.log('Error: Trying to save one of the checks');
        }
    });
};

// alert the user about check change
workers.alertUserStatusChange = (newCheckData) => {
    const msg = `Alert: your check for ${newCheckData.method.toUpperCase()} ${
        newCheckData.protocol
    }://${newCheckData.url} is currently ${newCheckData.state}`;

    // sent msg through twilio
    twilioSend(newCheckData.userPhone, msg, (err) => {
        if (!err) {
            console.log(`Message: ${msg}`);
        } else {
            console.log('Error: Cant send msg through twilio.');
        }
    });
};
// loop for getting all check data after 1 min
workers.loop = () => {
    setInterval(() => {
        workers.getAllChecks();
    }, 8000);
};

// workers call
workers.init = () => {
    workers.getAllChecks();

    workers.loop();
};

// export the module
module.exports = workers;
