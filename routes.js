/*
 *
 *
 ->Title: All Routes in this file
 ->Description: This is to handle all kind of routes in the project.
 ->Author: Shawon Talukder
 ->Date: 11/08/2022
 *
 *
 */

// dependencies
const { sampleHandler } = require('./handlers/routesHandlers/sampleHandler');
const { userHandler } = require('./handlers/routesHandlers/userHandler');
const { tokenHandler } = require('./handlers/routesHandlers/tokenHandler');
const { checkHandler } = require('./handlers/routesHandlers/checkHandler');

// model scuffolding
const routes = {
    sample: sampleHandler,
    user: userHandler,
    token: tokenHandler,
    check: checkHandler,
};

// export the model
module.exports = routes;
