// dependencies

// model scaffolding
const handler = {};

// structure
handler.notFoundHandler = (reqProperties, callback) => {
    callback(404, { message: ' 404 not found' });
};

// export
module.exports = handler;
