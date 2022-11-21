/*
 *
 *
 ->Title: Not Found Handler
 ->Description: This handler will handle notFound or erorr code 404 route
 ->Author: Shawon Talukder
 ->Date: 11/08/2022
 *
 *
 */

// module scaffolding
const handler = {};

// module structure
handler.notFoundHandler = (statusCode, callback) => {
    callback(404, {
        message: '404 Not Found',
    });
};

// export the module
module.exports = handler;
