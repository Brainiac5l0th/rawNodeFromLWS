/* eslint-disable no-underscore-dangle */
/* eslint-disable prettier/prettier */
/*
 *
 *
 ------->Title: User Handler
 ->Description: This handler will handle the /user route
 ------>Author: Shawon Talukder
 -------->Date: 11/08/2022
 *
 *
 */

// dependencies
const datalib = require('../../lib/data');
const { hash } = require('../../helpers/utilities');
const { parseJSON } = require('../../helpers/utilities');
const environment = require('../../helpers/environments');
const tokenHandler = require('./tokenHandler');

// module scaffolding
const handler = {};

// module structure
handler.userHandler = (reqProperties, callback) => {
  const acceptedMethods = ['get', 'post', 'put', 'delete'];
  if (acceptedMethods.indexOf(reqProperties.method) > -1) {
    handler.users[reqProperties.method](reqProperties, callback);
  } else {
    callback(405);
  }
};

// model scaffolding again for user handling
handler.users = {};

// users structure
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

  const password = typeof reqProperties.body.password === 'string'
    && reqProperties.body.password.trim().length > 0
      ? reqProperties.body.password
      : false;

  const tosAgreement = typeof reqProperties.body.tosAgreement === 'boolean'
      ? reqProperties.body.tosAgreement
      : false;

  if (firstName && lastName && phone && password && tosAgreement) {
    datalib.read('users', phone, (err) => {
      if (err) {
        const data = {
          firstName,
          lastName,
          phone,
          password: hash(password),
          tosAgreement,
        };

        // save the file into db
        datalib.create('users', phone, data, (error) => {
          if (!error) {
            callback(200, {
              message: 'User created successfully!',
            });
          } else {
            callback(500, {
              message: 'Can not create the user',
            });
          }
        });
      } else {
        callback(500, {
          message: 'There is an error in the server side',
        });
      }
    });
  } else {
    callback(400, {
      message: 'You have a problem in your request! Please try again',
    });
  }
};

handler.users.get = (reqProperties, callback) => {
  const phone = typeof reqProperties.queryStringObj.phone === 'string'
    && reqProperties.queryStringObj.phone.trim().length === 11
      ? reqProperties.queryStringObj.phone
      : false;

  if (phone) {
    const token = typeof reqProperties.headersObj.token === 'string' && reqProperties.headersObj.token.trim().length === environment.tokenlength
        ? reqProperties.headersObj.token
        : false;
      tokenHandler.tokens.verify(token, phone, (tokenID) => {
        if (tokenID) {
          datalib.read('users', phone, (err, uData) => {
            const user = { ...parseJSON(uData) };
            if (!err && user) {
              delete user.password;
              delete user.tosAgreement;
              callback(200, user);
            } else {
              callback(400, {
                message: `There is no user with Phone Number: ${phone}`,
              });
            }
          });
        } else {
          callback(403, { message: 'Authentication failure!' });
        }
      });
    } else {
        callback(400, { message: 'Put a valid phone number' });
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

  const password = typeof reqProperties.body.password === 'string'
    && reqProperties.body.password.trim().length > 0
      ? reqProperties.body.password
      : false;

  if (phone) {
    if (firstName || lastName || password) {
      const token = typeof (reqProperties.headersObj.token) === 'string' && reqProperties.headersObj.token.trim().length === environment.tokenlength ? reqProperties.headersObj.token : false;
      if (token) {
        datalib.read('users', phone, (error, uData) => {
          const userData = { ...parseJSON(uData) };
          if (!error && userData) {
            if (firstName) {
              userData.firstName = firstName;
            }
            if (lastName) {
              userData.lastName = lastName;
            }
            if (password) {
              userData.password = hash(password);
            }

            // update to the db
            datalib.update('users', phone, userData, (err) => {
              if (!err) {
                callback(200, {
                  message: 'User information changed successfully!',
                });
              } else {
                callback(500, {
                  message: 'There is an error in the server side',
                });
              }
            });
          } else {
            callback(400, {
              message: "Couldn't find the phone number. Please try a valid one",
            });
          }
        });
      } else {
        callback(403, { message: 'authentication Failure' });
      }
    }
  } else {
    callback(400, {
      message: 'There is an error in your request.',
    });
  }
};

handler.users.delete = (reqProperties, callback) => {
  const phone = typeof reqProperties.queryStringObj.phone === 'string'
    && reqProperties.queryStringObj.phone.trim().length === 11
      ? reqProperties.queryStringObj.phone
      : false;

  if (phone) {
    const token = typeof (reqProperties.headersObj.token) === 'string' && reqProperties.headersObj.token.trim().length === 25 ? reqProperties.headersObj.token : false;
    if (token) {
      datalib.read('users', phone, (err) => {
        if (!err) {
          datalib.delete('users', phone, (error) => {
            if (!error) {
              callback(200, { message: 'deleted successfully!' });
            } else {
              callback(500, { message: 'there is an error in the server' });
            }
          });
        } else {
          callback(400, {
            message: "Couldn't find the Phone number",
          });
        }
      });
    } else {
      callback(403, { message: 'authentication Failure' });
    }
  } else {
    callback(400, {
      message: 'There is an error in your request',
    });
  }
};

// export the module
module.exports = handler;
