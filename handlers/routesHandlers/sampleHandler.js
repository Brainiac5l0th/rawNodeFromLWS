/*
 *
 *
 ->Title: Sample Handler
 ->Description: This handler will handle the /sample route
 ->Author: Shawon Talukder
 ->Date: 11/08/2022
 *
 *
 */

// module scaffolding
const handler = {};

// module structure
handler.sampleHandler = (reqProperties, callback) => {
    callback(200, {
        message: 'This is the sample section',
    });
};
// export the module
module.exports = handler;
