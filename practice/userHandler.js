/* eslint-disable prettier/prettier */

// dependencies
const { hash, parseJSON } = require('./utilities');
const datalib = require('./data');

// model scaffolding
const handler = {};

// structure
handler.userHandler = (reqProperties, callback) => {
    const methods = ['get', 'post', 'put', 'delete'];
    if (methods.indexOf(reqProperties.method) > -1) {
        handler.users[reqProperties.method](reqProperties, callback);
    } else {
        callback(405, { message: 'There is a problem in your request.' });
    }
};

// model scaffolding for users
handler.users = {};

handler.users.post = (reqProperties, callback) => {
    const firstName = typeof reqProperties.body.firstName === 'string'
                    && reqProperties.body.firstName.trim().length > 0
                    ? reqProperties.body.firstName
                    : false;

    const lastName = typeof reqProperties.body.lastName === 'string'
                    && reqProperties.body.lastName.trim().length > 0
                    ? reqProperties.body.lastName
                    : false;

    const phone = typeof reqProperties.body.phone === 'string'
                && reqProperties.body.phone.trim().length === 11
                ? reqProperties.body.phone
                : false;

    const userName = typeof reqProperties.body.userName === 'string'
                   && reqProperties.body.userName.trim().length > 0
                   ? reqProperties.body.userName
                   : false;

    const password = typeof reqProperties.body.password === 'string'
                   && reqProperties.body.password.trim().length > 0
                   ? reqProperties.body.password
                   : false;

    const tosAgreement = typeof reqProperties.body.tosAgreement === 'boolean'
                        ? reqProperties.body.tosAgreement
                        : false;

    if (firstName && lastName && phone && password && userName && tosAgreement) {
        datalib.read('users', userName, (err) => {
            if (err) {
                const data = {
                    firstName,
                    lastName,
                    phone,
                    userName,
                    password: hash(password),
                    tosAgreement,
                };
                datalib.create('users', userName, data, (error) => {
                    if (error) {
                        callback(500, {
                            message: 'there is an error on the server side.',
                        });
                    } else callback(200, { message: 'User Created Successfully.' });
                });
            } else {
                callback(400, {
                    message: 'there is an existing file on that username.',
                });
            }
        });
    } else {
        callback(400, {
            message: 'There is a problem in your request',
        });
    }
};

// auth baki
handler.users.get = (reqProperties, callback) => {
    const userName = typeof reqProperties.queryStringObj.userName === 'string'
                   && reqProperties.queryStringObj.userName.trim().length > 0
                   ? reqProperties.queryStringObj.userName
                   : false;
    if (userName) {
        datalib.read('users', userName, (err, data) => {
            if (!err && data) {
                const userData = { ...parseJSON(data) };
                delete userData.password;
                delete userData.tosAgreement;
                callback(200, userData);
            } else {
                callback(404, { message: 'there is no information for this username.' });
            }
        });
    } else {
        callback(405, { message: 'there is an error in your request. Please enter a valid username' });
    }
};

handler.users.put = (reqProperties, callback) => {
    const firstName = typeof reqProperties.body.firstName === 'string'
                    && reqProperties.body.firstName.trim().length > 0
                    ? reqProperties.body.firstName
                    : false;

    const lastName = typeof reqProperties.body.lastName === 'string'
                    && reqProperties.body.lastName.trim().length > 0
                    ? reqProperties.body.lastName
                    : false;

    const phone = typeof reqProperties.body.phone === 'string'
                && reqProperties.body.phone.trim().length === 11
                ? reqProperties.body.phone
                : false;

    const userName = typeof reqProperties.body.userName === 'string'
                   && reqProperties.body.userName.trim().length > 0
                   ? reqProperties.body.userName
                   : false;

    const password = typeof reqProperties.body.password === 'string'
                   && reqProperties.body.password.trim().length > 0
                   ? reqProperties.body.password
                   : false;

    if (userName) {
        if (firstName || lastName || password || phone) {
        datalib.read('users', userName, (err, data) => {
            if (!err && data) {
                const userData = { ...parseJSON(data) };
                if (firstName) {
                    userData.firstName = firstName;
                }
                if (lastName) {
                    userData.lastName = lastName;
                }
                if (password) {
                    userData.password = hash(password);
                }
                if (phone) {
                    userData.phone = phone;
                }
                datalib.update('users', userName, userData, (error) => {
                    if (!error) {
                        callback(200, { message: 'User information updated successfully.' });
                    } else {
                        callback(500, { message: 'Sorry! There is a problem in the server side.' });
                    }
                });
            } else {
                callback(404, { message: 'There is no data for this userName.' });
            }
        });
    }
    } else {
        callback(405, { message: 'there is a problem in your request. Try again later.' });
    }
};

handler.users.delete = (reqProperties, callback) => {
    const userName = typeof reqProperties.queryStringObj.userName === 'string'
                   && reqProperties.queryStringObj.userName.trim().length > 0
                   ? reqProperties.queryStringObj.userName
                   : false;
    if (userName) {
        datalib.read('users', userName, (err, data) => {
            if (!err && data) {
                datalib.delete('users', userName, (error) => {
                    if (!error) {
                        callback(200, { message: 'user deleted successfully.' });
                    } else {
                        callback(500, { message: 'Sorry!there is an error in the server side.' });
                    }
                });
            } else {
                callback(404, { message: 'Invalid Username.' });
            }
        });
    } else {
        callback(405, { message: 'There is an error in your request.' });
    }
};

// export
module.exports = handler;
