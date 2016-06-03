exports.register = function (server, options, next) {
    var env = require('../env.js');
    var node_env = process.env.NODE_ENV || 'development';
    server.decorate('server', 'env', env[node_env]);
    next();
};

exports.register.attributes = {
    name : 'env'
};
