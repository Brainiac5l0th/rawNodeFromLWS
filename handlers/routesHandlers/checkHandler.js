/* eslint-disable comma-dangle */
/* eslint-disable operator-linebreak */
/*
 *
 *
 ->Title: Check Handler
 ->Description: This handler is to handle user defined checks
 ->Author: Shawon Talukder
 ->Date: 11/07/2022
 *
 *
 */

// dependencies
const datalib = require('../../lib/data');
const { parseJSON, randomTXT } = require('../../helpers/utilities');
const tokenHandler = require('./tokenHandler');
const environment = require('../../helpers/environments');

// module scaffolding
const handler = {};

// module structure
handler.checkHandler = (reqProperties, callback) => {
    const acceptedMethods = ['get', 'post', 'put', 'delete'];
    if (acceptedMethods.indexOf(reqProperties.method) > -1) {
        handler.checks[reqProperties.method](reqProperties, callback);
    } else {
        callback(405);
    }
};

// model scaffolding again for checks handling
handler.checks = {};

// users structure
handler.checks.post = (reqProperties, callback) => {
    // validate inputs
    const protocol =
        typeof reqProperties.body.protocol === 'string' &&
        ['http', 'https'].indexOf(reqProperties.body.protocol) > -1
            ? reqProperties.body.protocol
            : false;
    const url =
        typeof reqProperties.body.url === 'string' && reqProperties.body.url.trim().length > 0
            ? reqProperties.body.url
            : false;
    const method =
        typeof reqProperties.body.method === 'string' &&
        ['GET', 'POST', 'PUT', 'DELETE'].indexOf(reqProperties.body.method) > -1
            ? reqProperties.body.method
            : false;
    const successCodes =
        typeof reqProperties.body.successCodes === 'object' &&
        reqProperties.body.successCodes instanceof Array
            ? reqProperties.body.successCodes
            : false;
    const timeOutSec =
        typeof reqProperties.body.timeOutSec === 'number' &&
        reqProperties.body.timeOutSec % 1 === 0 &&
        reqProperties.body.timeOutSec >= 1 &&
        reqProperties.body.timeOutSec <= 5
            ? reqProperties.body.timeOutSec
            : false;
    console.log(protocol, url, method, successCodes, timeOutSec);
    if (protocol && url && method && successCodes && timeOutSec) {
        const token =
            typeof reqProperties.headersObj.token === 'string' &&
            reqProperties.headersObj.token.trim().length === environment.tokenlength
                ? reqProperties.headersObj.token
                : false;
        if (token) {
            datalib.read('tokens', token, (err, data) => {
                if (!err && data) {
                    const userPhone = parseJSON(data).phone;

                    datalib.read('users', userPhone, (err2, userData) => {
                        if (!err2 && userData) {
                            tokenHandler.tokens.verify(token, userPhone, (isValid) => {
                                if (isValid) {
                                    const userObj = parseJSON(userData);
                                    const userChecks =
                                        typeof userObj.checks === 'object' &&
                                        userObj.checks instanceof Array
                                            ? userObj.checks
                                            : [];
                                    if (userChecks.length < environment.checkLimit) {
                                        const checkId = randomTXT(environment.tokenlength);
                                        const checkObj = {
                                            checkId,
                                            userPhone,
                                            protocol,
                                            url,
                                            method,
                                            successCodes,
                                            timeOutSec,
                                        };

                                        // save the obj
                                        datalib.create('checks', checkId, checkObj, (err3) => {
                                            if (!err3) {
                                                // assign check values
                                                userObj.checks = userChecks;
                                                userObj.checks.push(checkId);
                                                // update the file
                                                datalib.update(
                                                    'users',
                                                    userPhone,
                                                    userObj,
                                                    (err4) => {
                                                        if (!err4) {
                                                            callback(200, userObj);
                                                        } else {
                                                            callback(500, {
                                                                error: 'Server side error!',
                                                            });
                                                        }
                                                    }
                                                );
                                            } else {
                                                callback(500, { error: 'Server side error!' });
                                            }
                                        });
                                    } else {
                                        callback(401, { error: 'User has reached max limit!' });
                                    }
                                } else {
                                    callback(403, { error: 'Authentication Failure!' });
                                }
                            });
                        } else {
                            callback(401, { error: "Can't find the user information." });
                        }
                    });
                } else {
                    callback(403, { error: 'Authentication Failure!' });
                }
            });
        } else {
            callback(403, { error: 'Authentication Failure!' });
        }
    } else {
        callback(400, { error: 'there is an error in your request' });
    }
};

handler.checks.get = (reqProperties, callback) => {
    const id =
        typeof reqProperties.queryStringObj.id === 'string' &&
        reqProperties.queryStringObj.id.trim().length === environment.tokenlength
            ? reqProperties.queryStringObj.id
            : false;
    if (id) {
        datalib.read('checks', id, (err1, checkData) => {
            if (!err1 && checkData) {
                const token =
                    typeof reqProperties.headersObj.token === 'string' &&
                    reqProperties.headersObj.token.trim().length === environment.tokenlength
                        ? reqProperties.headersObj.token
                        : false;
                tokenHandler.tokens.verify(token, parseJSON(checkData).userPhone, (isValid) => {
                    if (isValid) {
                        callback(200, parseJSON(checkData));
                    } else {
                        callback(403, { error: 'Authentication Problem!' });
                    }
                });
            } else {
                callback(404, { error: 'cant find the check' });
            }
        });
    } else {
        callback(400, { error: 'there is an error in your request' });
    }
};

handler.checks.put = (reqProperties, callback) => {
    const checkId =
        typeof reqProperties.body.checkId === 'string' &&
        reqProperties.body.checkId.trim().length === environment.tokenlength
            ? reqProperties.body.checkId
            : false;
    const protocol =
        typeof reqProperties.body.protocol === 'string' &&
        ['http', 'https'].indexOf(reqProperties.body.protocol) > -1
            ? reqProperties.body.protocol
            : false;
    const url =
        typeof reqProperties.body.url === 'string' && reqProperties.body.url.trim().length > 0
            ? reqProperties.body.url
            : false;
    const method =
        typeof reqProperties.body.method === 'string' &&
        ['GET', 'POST', 'PUT', 'DELETE'].indexOf(reqProperties.body.method) > -1
            ? reqProperties.body.method
            : false;
    const successCodes =
        typeof reqProperties.body.successCodes === 'object' &&
        reqProperties.body.successCodes instanceof Array
            ? reqProperties.body.successCodes
            : false;
    const timeOutSec =
        typeof reqProperties.body.timeOutSec === 'number' &&
        reqProperties.body.timeOutSec % 1 === 0 &&
        reqProperties.body.timeOutSec >= 1 &&
        reqProperties.body.timeOutSec <= 5
            ? reqProperties.body.timeOutSec
            : false;
    if (checkId) {
        if (protocol || url || method || successCodes || timeOutSec) {
            datalib.read('checks', checkId, (err1, checkData) => {
                if (!err1 && checkData) {
                    const token =
                        typeof reqProperties.headersObj.token === 'string' &&
                        reqProperties.headersObj.token.trim().length === environment.tokenlength
                            ? reqProperties.headersObj.token
                            : false;
                    tokenHandler.tokens.verify(token, parseJSON(checkData).userPhone, (isValid) => {
                        if (isValid) {
                            const checkObj = parseJSON(checkData);
                            if (protocol) checkObj.protocol = protocol;
                            if (url) checkObj.url = url;
                            if (method) checkObj.method = method;
                            if (successCodes) checkObj.successCodes = successCodes;
                            if (timeOutSec) checkObj.timeOutSec = timeOutSec;

                            // update the value
                            datalib.update('checks', checkId, checkObj, (err2) => {
                                if (!err2) {
                                    callback(200, checkObj);
                                } else {
                                    callback(500, { error: 'Server side problem' });
                                }
                            });
                        } else {
                            callback(403, { error: 'Authentication Failure!' });
                        }
                    });
                } else {
                    callback(404, { error: 'check no found' });
                }
            });
        } else {
            callback(400, { error: 'there is a problem in your request' });
        }
    } else {
        callback(400, { error: 'there is a problem in your request' });
    }
};

handler.checks.delete = (reqProperties, callback) => {
    const id =
        typeof reqProperties.queryStringObj.id === 'string' &&
        reqProperties.queryStringObj.id.trim().length === environment.tokenlength
            ? reqProperties.queryStringObj.id
            : false;
    if (id) {
        datalib.read('checks', id, (err1, checkData) => {
            if (!err1 && checkData) {
                const token =
                    typeof reqProperties.headersObj.token === 'string' &&
                    reqProperties.headersObj.token.trim().length === environment.tokenlength
                        ? reqProperties.headersObj.token
                        : false;
                tokenHandler.tokens.verify(token, parseJSON(checkData).userPhone, (isValid) => {
                    if (isValid) {
                        datalib.delete('checks', id, (err2) => {
                            if (!err2) {
                                datalib.read(
                                    'users',
                                    parseJSON(checkData).userPhone,
                                    (err3, udata) => {
                                        if (!err3 && udata) {
                                            const userData = { ...parseJSON(udata) };
                                            const userChecks =
                                                typeof userData.checks === 'object' &&
                                                userData.checks instanceof Array
                                                    ? userData.checks
                                                    : false;
                                            if (userChecks) {
                                                const position = userChecks.indexOf(id);
                                                if (position > -1) {
                                                    userChecks.splice(position, 1);
                                                    userData.checks = userChecks;
                                                    // update the data
                                                    datalib.update(
                                                        'users',
                                                        userData.phone,
                                                        userData,
                                                        (err4) => {
                                                            if (!err4) {
                                                                callback(200, userData);
                                                            } else {
                                                                callback(500, {
                                                                    error: 'server side problem',
                                                                });
                                                            }
                                                        }
                                                    );
                                                }
                                            }
                                        } else {
                                            callback(500, { error: 'server side problem' });
                                        }
                                    }
                                );
                            } else {
                                callback(500, { error: 'server side problem' });
                            }
                        });
                    } else {
                        callback(403, { error: 'Authentication Failure!' });
                    }
                });
            } else {
                callback(404, { error: "can't find the check." });
            }
        });
    } else {
        callback(400, { error: 'there is a problem in your request' });
    }
};

// export the module
module.exports = handler;
