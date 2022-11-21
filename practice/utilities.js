// dependencies
const crypto = require('crypto');
const environments = require('./environments');
// model scaffolding
const utilities = {};

// structure

// parse string
utilities.parseJSON = (str) => {
    let output;
    try {
        output = JSON.parse(str);
    } catch {
        output = {};
    }
    return output;
};

// hash a string
utilities.hash = (str) => {
    if (typeof str === 'string' && str.length > 0) {
        const hash = crypto.createHmac('sha256', environments.secretkey).update(str).digest('hex');
        return hash;
    }
    return false;
};

// generate random string
utilities.randomTXT = (strlen) => {
    if (typeof strlen === 'number' && strlen > 0) {
        let output = '';
        const possibleChar = 'abcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 1; i <= strlen; i += 1) {
            const randomchar = possibleChar.charAt(Math.floor(Math.random() * possibleChar.length));
            output += randomchar;
        }
        return output;
    }
    return false;
};
// export
module.exports = utilities;
