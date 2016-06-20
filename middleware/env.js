exports.register = function (server, options, next) {
    var env = require('../env.js');
    var node_env = process.env.NODE_ENV || 'development';
    console.log('Using ' + node_env + ' environment');
    server.decorate('server', 'env', env[node_env]);
    next();
};

exports.register.attributes = {
    name : 'env'
};
