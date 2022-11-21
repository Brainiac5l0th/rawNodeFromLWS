/*
 *
 *
 ->Title: Environments Handling
 ->Description: Handle all environment datas
 ->Author: Shawon Talukder
 ->Date: 11/07/2022
 *
 *
 */

// dependencies

// module scaffolding
const environments = {};

// define envs for each port
environments.staging = {
    port: 3000,
    envName: 'Staging/Development',
    secretkey: 'abcdefghij',
    tokenlength: 25,
    checkLimit: 5,
    twilio: {
        fromPhone: '+17175276017',
        accountSid: 'AC3f336b87f8355cf094edd002fc95efc1',
        authToken: '5bca109ad81ebd5c4533de63848e9d1f',
    },
};

environments.production = {
    port: 8000,
    envName: 'production',
    secretkey: '123456789',
    tokenlength: 25,
    checkLimit: 5,
    twilio: {
        fromPhone: '+17175276017',
        accountSid: 'AC3f336b87f8355cf094edd002fc95efc1',
        authToken: '5bca109ad81ebd5c4533de63848e9d1f',
    },
};

// determine which environment was passed
// eslint-disable-next-line prettier/prettier
const currentEnvironment = typeof process.env.NODE_ENV === 'string' ? process.env.NODE_ENV : 'staging';

// export corresponding environment object
// eslint-disable-next-line prettier/prettier
const exportEnv = typeof environments[currentEnvironment] === 'object'
        ? environments[currentEnvironment]
        : environments.staging;

// export module
module.exports = exportEnv;
