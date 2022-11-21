// dependencies
const url = require('url');
const { StringDecoder } = require('string_decoder');
const routes = require('./routes');
const { notFoundHandler } = require('./notFound');
const { parseJSON } = require('./utilities');

// module scaffolding
const handle = {};

// model structure
handle.handleReqRes = (req, res) => {
    // parsing data
    const parsedURL = url.parse(req.url, true);
    const path = parsedURL.pathname;
    const trimmedPath = path.replace(/^\/+|\/+$/g, '');
    const method = req.method.toLowerCase();
    const queryStringObj = parsedURL.query;
    const headersObj = req.headers;

    const reqProperties = {
        parsedURL,
        path,
        trimmedPath,
        method,
        queryStringObj,
        headersObj,
    };
    // body parsing
    // eslint-disable-next-line no-unused-vars
    let realData = '';
    const decoder = new StringDecoder('utf-8');
    req.on('data', (chunk) => {
        realData += decoder.write(chunk);
    });
    req.on('end', () => {
        // body parsing ends
        realData += decoder.end();
        reqProperties.body = parseJSON(realData);
        // route handling
        const choosenHandler = routes[trimmedPath] ? routes[trimmedPath] : notFoundHandler;
        choosenHandler(reqProperties, (statusCode, payload) => {
            const status = typeof statusCode === 'number' ? statusCode : 500;
            const payloadData = typeof payload === 'object' ? payload : {};
            const payloadStr = JSON.stringify(payloadData);

            // reponse handling
            res.setHeader('content-type', 'application/json');
            res.writeHead(status);
            res.end(payloadStr);
        });
    });
};

// export
module.exports = handle;
