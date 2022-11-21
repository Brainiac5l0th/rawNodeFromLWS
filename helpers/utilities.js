/*
 *
 *
 ->Title: utility file
 ->Description: this is to store multiple small utility files
 ->Author: Shawon Talukder
 ->Date: 11/08/2022
 *
 *
 */

// dependencies
const crypto = require('crypto');
const environments = require('./environments');

// module scaffolding
const utilities = {};

// module structure
utilities.parseJSON = (strData) => {
    let output;
    try {
        output = JSON.parse(strData);
    } catch {
        output = {};
    }
    return output;
};

// hashing the string
utilities.hash = (str) => {
    if (typeof str === 'string' && str.length > 0) {
        const hash = crypto.createHmac('sha256', environments.secretkey).update(str).digest('hex');
        return hash;
    }
    return false;
};

// create random string
utilities.randomTXT = (strLength) => {
    const length = typeof strLength === 'number' && strLength > 0 ? strLength : false;
    if (length) {
        const possibleChar = 'abcdefghijklmnopqrstuvwxyz0123456789';
        let output = '';
        for (let i = 1; i <= length; i += 1) {
            const randomChar = possibleChar.charAt(Math.floor(Math.random() * possibleChar.length));
            output += randomChar;
        }
        return output;
    }
    return false;
};

// export the module
module.exports = utilities;
