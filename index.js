/*
 *
 *
 ->Title: Uptime Monitoring App
 ->Description: It is a simple monitoring api using raw node js
 ->Author: Shawon Talukder
 ->Date: 11/07/2022
 *
 *
 */

// dependencies
const server = require('./lib/server');
const workers = require('./lib/workers');

// app object - module scaffoling
const app = {};

// structure

app.init = () => {
    // initialize the server
    server.init();

    // initialize the workers
    workers.init();
};

// start the project
app.init();

// export module
module.exports = app;
