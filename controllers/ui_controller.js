'use strict';

const ready = function(server, next) {
    next();
}

exports.register = function (server, options, next) {
    server.dependency('auth', ready);
    next();
};

exports.register.attributes = {
    name : 'ui_controller'
};
