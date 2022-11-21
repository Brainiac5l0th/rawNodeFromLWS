/*
 *
 *
 ->Title: Practice section
 ->Description: This section is for practicing what I have learned till now.
 ->Author: Shawon Talukder
 ->Date: 11/07/2022
 *
 *
 */
// dependencies
const http = require('http');
const { handleReqRes } = require('./handleReqRes');
const environment = require('./environments');

// model scaffolding
const app = {};

// create server
app.createServer = () => {
    const server = http.createServer(app.handleReqRes);
    server.listen(environment.port, () => {
        console.log(`Listening: ${environment.port}`);
    });
};

// handleReqres
app.handleReqRes = handleReqRes;

// server call
app.createServer();
