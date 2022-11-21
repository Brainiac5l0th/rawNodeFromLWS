/* eslint-disable prettier/prettier */
/*
 *
 *
 ------->Title: Token Handler
 ->Description: This handler will handle the /token route so that it can be used as authentication
 ------>Author: Shawon Talukder
 -------->Date: 11/14/2022
 *
 *
 */

// dependencies
const datalib = require('../../lib/data');
const { hash, randomTXT, parseJSON } = require('../../helpers/utilities');
const environment = require('../../helpers/environments');

// module scaffolding
const handler = {};

// module structure
handler.tokenHandler = (reqProperties, callback) => {
  const acceptedMethods = ['get', 'post', 'put', 'delete'];
  if (acceptedMethods.indexOf(reqProperties.method) > -1) {
    handler.tokens[reqProperties.method](reqProperties, callback);
  } else {
    callback(405);
  }
};

// model scaffolding again for user handling
handler.tokens = {};

// users structure
handler.tokens.post = (reqProperties, callback) => {
  const phone = typeof reqProperties.body.phone === 'string'
    && reqProperties.body.phone.trim().length === 11
      ? reqProperties.body.phone
      : false;

  const password = typeof reqProperties.body.password === 'string'
    && reqProperties.body.password.trim().length > 0
      ? reqProperties.body.password
      : false;

  if (phone && password) {
    datalib.read('users', phone, (err, data) => {
      if (!err && data) {
        const hashedPass = hash(password);
        if (hashedPass === parseJSON(data).password) {
          const tokenID = randomTXT(environment.tokenlength);
          const expires = Date.now() + 60 * 60 * 1000;
          const tokenObj = {
            phone,
            tokenID,
            expires,
          };

          // store the token
          datalib.create('tokens', tokenID, tokenObj, (error) => {
            if (!error) {
              callback(200, tokenObj);
            } else {
              callback(500, {
                message: 'There was a problem in the server side.',
              });
            }
          });
        } else {
          callback(400, { message: 'Password invalid!' });
        }
      } else {
        callback(404, { message: "Phone number don't match" });
      }
    });
  } else {
    callback(400, {
      message: 'You have a problem in your request! Please try again',
    });
  }
};

handler.tokens.get = (reqProperties, callback) => {
  const token = typeof reqProperties.queryStringObj.token === 'string'
    && reqProperties.queryStringObj.token.trim().length === environment.tokenlength
      ? reqProperties.queryStringObj.token
      : false;
  if (token) {
    datalib.read('tokens', token, (err, tokenData) => {
      if (!err && tokenData) {
        callback(200, tokenData);
      } else {
        callback(400, {
          message: `Can't find Token${token}`,
        });
      }
    });
  } else {
    callback(404, {
      message: `Can't find Token${token}`,
    });
  }
};

handler.tokens.put = (reqProperties, callback) => {
  const token = typeof reqProperties.body.tokenID === 'string'
    && reqProperties.body.tokenID.trim().length === environment.tokenlength
      ? reqProperties.body.tokenID
      : false;
  const extend = typeof reqProperties.body.extend === 'boolean'
    && reqProperties.body.extend === true
      ? reqProperties.body.extend
      : false;

  if (token && extend) {
    datalib.read('tokens', token, (err, tData) => {
      if (!err && tData) {
        const tokenData = { ...parseJSON(tData) };
        if (tokenData.expires > Date.now()) {
          tokenData.expires = Date.now() + 60 * 60 * 1000;
          datalib.update('tokens', token, tokenData, (err2) => {
            if (!err2) {
              callback(200);
            } else {
              callback(500, { message: 'there is a server side error.' });
            }
          });
        } else {
          callback(405, { message: 'Token already expired!' });
        }
      } else {
        callback(404, { message: 'there is no data for this token' });
      }
    });
  } else {
    callback(400, {
      message: 'There is an error in your request.',
    });
  }
};

handler.tokens.delete = (reqProperties, callback) => {
  const token = typeof reqProperties.queryStringObj.token === 'string'
    && reqProperties.queryStringObj.token.trim().length === environment.tokenlength
      ? reqProperties.queryStringObj.token
      : false;

  if (token) {
    datalib.read('tokens', token, (err) => {
      if (!err) {
        datalib.delete('tokens', token, (error) => {
          if (!error) {
            callback(200);
          } else {
            callback(500, { message: 'there is an error in the server' });
          }
        });
      } else {
        callback(400, {
          message: "Couldn't find the token",
        });
      }
    });
  } else {
    callback(400, {
      message: 'There is an error in your request',
    });
  }
};

handler.tokens.verify = (token, phone, callback) => {
  datalib.read('tokens', token, (err, tokenData) => {
    if (!err && tokenData) {
      if (
        parseJSON(tokenData).phone === phone
        && parseJSON(tokenData).expires > Date.now()
      ) {
        callback(true);
      } else {
        callback(false);
      }
    } else {
      callback(false);
    }
  });
};

// export the module
module.exports = handler;
