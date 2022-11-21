// dependencies

// model scaffolding
const handler = {};

// structure
handler.aboutHandler = (reqProperties, callback) => {
    callback(200, { message: 'this is about information' });
};

// export
module.exports = handler;
