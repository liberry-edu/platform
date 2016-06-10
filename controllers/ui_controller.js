'use strict';

var ready = function(server, next) {

    server.route({
        method: 'GET',
        path: '/',
        config : {
            handler: {
                file: 'public/'  + server.env.mode + '/html/index.html'
            },
            auth: false
        }
    });

    next();
}

exports.register = function (server, options, next) {
    server.dependency('auth', ready);
    next();
};

exports.register.attributes = {
    name : 'ui_controller'
};
