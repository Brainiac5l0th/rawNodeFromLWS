/*
 *
 *
 ------->Title: server file
 ->Description: This is the server file for "Uptime monitoring app"
 ------>Author: Shawon Talukder
 -------->Date: 11/07/2022
 *
 *
 */

// dependencies
const http = require('http');
const { handleReqRes } = require('../helpers/handleReqRes');
const env = require('../helpers/environments');

// app object - module scaffoling
const server = {};

// create server
server.createServer = () => {
    const serverValiable = http.createServer(server.handleReqRes);
    serverValiable.listen(env.port, () => {
        console.log(`${env.envName} : Listening to port ${env.port}`);
    });
};

// handle req and res in server
server.handleReqRes = handleReqRes;

// server call
server.init = () => {
    server.createServer();
};

// export the module
module.exports = server;
