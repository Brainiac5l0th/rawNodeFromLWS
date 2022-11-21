// dependencies

// model scaffolding
const environs = {};

// staging or developement
environs.staging = {
    port: 5001,
    envName: 'Staging',
    secretkey: 'abcd1234',
};

// production
environs.production = {
    port: 5005,
    envName: 'production',
    secretkey: '1234xyz',
};

// environment passed
const envPassed = typeof process.env.NODE_ENV === 'string' ? process.env.NODE_ENV : 'staging';

// choose env
const toexpEnv = typeof environs[envPassed] === 'object' ? environs[envPassed] : environs.staging;

module.exports = toexpEnv;
