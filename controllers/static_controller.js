'use strict';

var ready = function(server, next) {

    server.route({
        method: 'GET',
        path: '/{param*}',
        config : {
            handler: {
                directory: {
                    path: ['../public/' + server.env.mode, '../node_modules'],
                    //index: ['html/index.html']
                }
            },
            auth: false
        }
    });

    server.route({
        method: 'GET',
        path: '/',
        config : {
            handler: {
                file: '../public'  + server.env.mode + '/html/index.html'
            },
            auth: false
        }
    });

    next();
}

exports.register = function (server, options, next) {
    server.dependency('env', ready);
    next();
};

exports.register.attributes = {
    name : 'static_controller'
};
