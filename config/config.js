const environment = process.env.NODE_ENV || 'development';
const dev = require("./config.dev");

var config = {};
switch (environment) {
    default:
        config = dev;
        break;
}

module.exports = config;