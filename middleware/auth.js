'use strict';

var ready = function (server, next) {
    const Bcrypt = require('bcrypt');
    const Basic = require('hapi-auth-basic');
    const Authorization = require('hapi-authorization');
    const Boom = require('boom');

    const validate = function (request, username, password, callback) {
        server.db.User.findOne({
          where: {
            username: username
          }
        }).then(function(user) {
          if (!user) {
              return callback(null, false);
          }
          else {
            Bcrypt.compare(password, user.password, (err, isValid) => {
                if(err) {
                    err = Boom.badImplementation(err);
                }
                callback(err, isValid, user);
            });
          }
        });
    };

    var plugins = [
        {
            register: Basic
        },
        {
            register: Authorization
        }
    ];

    server.register(plugins, (err) => {
        server.auth.strategy('simple', 'basic', {
            validateFunc: validate
        });
        server.auth.default('simple');
    });

    next();
};

exports.register = function (server, options, next) {
    server.dependency('db', ready);
    next();
};

exports.register.attributes = {
    name : 'auth'
};
