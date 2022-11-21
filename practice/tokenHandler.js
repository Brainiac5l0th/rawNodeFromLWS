/* eslint-disable prettier/prettier */

// dependencies
const { hash, parseJSON, randomTXT } = require('./utilities');
const datalib = require('./data');

// model scaffolding
const handler = {};

// structure
handler.tokenHandler = (reqProperties, callback) => {
  const methods = ['get', 'post', 'put', 'delete'];
  if (methods.indexOf(reqProperties.method) > -1) {
    handler.tokens[reqProperties.method](reqProperties, callback);
  } else {
    callback(405, { message: 'There is a problem in your request.' });
  }
};

// model scaffolding for users
handler.tokens = {};

handler.tokens.post = (reqProperties, callback) => {
  const userName = typeof reqProperties.body.userName === 'string'
    && reqProperties.body.userName.trim().length > 0
      ? reqProperties.body.userName
      : false;
  const password = typeof reqProperties.body.password === 'string'
    && reqProperties.body.password.trim().length > 0
      ? reqProperties.body.password
      : false;

  if (userName && password) {
    datalib.read('users', userName, (err, data) => {
      if (!err && data) {
        const hashedPass = hash(password);
        if (parseJSON(data).password === hashedPass) {
          const tokenId = randomTXT(15);
          const expires = Date.now() + 60 * 60 * 1000;
          const tokenObj = {
            userName,
            tokenId,
            expires,
          };
          datalib.create('tokens', tokenId, tokenObj, (error) => {
            if (!error) {
              callback(200);
            } else {
              callback(400, {
                message: "Can't create a token file.It may exists already",
              });
            }
          });
        } else {
          callback(400, { message: "password don't match" });
        }
      }
    });
  } else {
    callback(400, {
      message: 'There is a problem in your request',
    });
  }
};

handler.tokens.get = (reqProperties, callback) => {
  const token = typeof reqProperties.queryStringObj.token === 'string'
    && reqProperties.queryStringObj.token.trim().length === 15
      ? reqProperties.queryStringObj.token
      : false;

  if (token) {
    datalib.read('tokens', token, (err, data) => {
      const tokenData = { ...parseJSON(data) };
      if (!err && tokenData) {
        callback(200, tokenData);
      } else {
        callback(404, { message: 'there is no information for this token' });
      }
    });
  } else {
    callback(400, { message: 'invalid token' });
  }
};

handler.tokens.put = (reqProperties, callback) => {
  const token = typeof reqProperties.body.token === 'string'
    && reqProperties.body.token.trim().length === 15
      ? reqProperties.body.token
      : false;
  const extend = typeof reqProperties.body.extend === 'boolean'
    && reqProperties.body.extend === true
      ? reqProperties.body.extend
      : false;
  if (token && extend) {
    datalib.read('tokens', token, (err, data) => {
      const tokenData = { ...parseJSON(data) };
      if (!err && tokenData) {
        if (tokenData.expires > Date.now()) {
          tokenData.expires = Date.now() + 60 * 60 * 1000;
          datalib.update('tokens', token, tokenData, (error) => {
            if (!error) {
              callback(200, { message: 'successfully updated!' });
            } else {
              callback(500, { message: 'sorry!there is a server problem' });
            }
          });
        } else {
          callback(400, { message: 'token already expired.' });
        }
      } else {
        callback(404, { message: 'there is no data for this token' });
      }
    });
  } else {
    callback(400, { message: 'bad request' });
  }
};

handler.tokens.delete = (reqProperties, callback) => {
    const token = typeof reqProperties.queryStringObj.token === 'string'
    && reqProperties.queryStringObj.token.trim().length === 15
      ? reqProperties.queryStringObj.token
      : false;
      if (token) {
        datalib.read('tokens', token, (err, data) => {
            if (!err && data) {
                datalib.delete('tokens', token, (error) => {
                    if (!error) {
                        callback(200, { message: 'success!' });
                    } else {
                        callback(500, { message: 'server side error' });
                    }
                });
            } else {
                callback(404, { message: "can't find the file" });
            }
        });
      } else {
        callback(400, { message: 'bad request' });
      }
};

// export
module.exports = handler;
