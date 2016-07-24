'use strict';

const Joi = require("joi");

var ready = function(server, next) {

    server.route({
        method: 'GET',
        path: '/{param*}',
        config : {
            description: "This endpoint is used to get a static file from server",
            notes: 'Files only from public directory or node_modules directory are served',
            tags: ["api"],
            validate: {
                    params: {
                        param: Joi.string().required().description("The path of the file to serve")
                    }
            },
            handler: {
                directory: {
                    path: ['public/' + server.env.mode, 'node_modules']
                }
            },
            auth: false
        }
    });

    next();
};

exports.register = function (server, options, next) {
    server.dependency('auth', ready);
    next();
};

exports.register.attributes = {
    name : 'static_controller'
};
