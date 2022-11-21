/*
 *
 *
 ------->Title: Handle Request and Response
 ->Description: this helper is to export request and response function
 ------>Author: Shawon Talukder
 -------->Date: 11/07/2022
 *
 *
 */

// Dependencies
const url = require('url');
const { StringDecoder } = require('string_decoder');
const routes = require('../routes');
const { notFoundHandler } = require('../handlers/routesHandlers/notFoundHandler');
const { parseJSON } = require('./utilities');

// model scaffolding
const handler = {};

// helper function
handler.handleReqRes = (req, res) => {
    // request handling
    const parsedURL = url.parse(req.url, true);
    const path = parsedURL.pathname;
    const trimmedPath = path.replace(/^\/+|\/+$/g, '');
    const method = req.method.toLowerCase();
    const queryStringObj = parsedURL.query;
    const headersObj = req.headers;

    // route handling
    const reqProperties = {
        parsedURL,
        path,
        trimmedPath,
        method,
        queryStringObj,
        headersObj,
    };

    // parsing body from req
    const decoder = new StringDecoder('utf-8');
    let realData = '';
    req.on('data', (buffer) => {
        realData += decoder.write(buffer);
    });
    req.on('end', () => {
        realData += decoder.end();
        reqProperties.body = parseJSON(realData);
        // handling routes
        const choosenHandler = routes[trimmedPath] ? routes[trimmedPath] : notFoundHandler;
        choosenHandler(reqProperties, (statusCode, payload) => {
            const status = typeof statusCode === 'number' ? statusCode : 500;
            const payback = typeof payload === 'object' ? payload : {};

            const payloadStr = JSON.stringify(payback);

            // RESPONSE HANDLING
            res.setHeader('content-type', 'application/json');
            res.writeHead(status);
            res.end(payloadStr);
        });
    });
};

module.exports = handler;
