// dependencies
const { aboutHandler } = require('./aboutHandler');
const { userHandler } = require('./userHandler');
const { tokenHandler } = require('./tokenHandler');

// module scaffolding
const routes = {
    about: aboutHandler,
    user: userHandler,
    token: tokenHandler,
};

// export
module.exports = routes;
