'use strict';

const Bcrypt = require('bcrypt');
const Basic = require('hapi-auth-cookie');
const Authorization = require('hapi-authorization');
const Boom = require('boom');

const login = function (request, reply) {
    server.db.User.findOne({
      where: {
        username: request.payload.username
      }
    }).then(function(user) {
      if (!user) {
          return reply(Boom.unauthorized('Invalid username or password'));
      }
      else {
        Bcrypt.compare(request.payload.password, user.password, (err, isValid) => {
            if(err) {
                err = Boom.badImplementation(err);
            }
            request.cookieAuth.set(user);
            return reply('Success');
        });
      }
    });
}

const logout = function (request, reply) {
    request.cookieAuth.clear();
    return reply('Success');
};

var ready = function (server, next) {

    var plugins = [
        {
            register: Basic
        },
        {
            register: Authorization
        }
    ];

    server.register(plugins, (err) => {
        server.auth.strategy('session', 'cookie', true, {
            password: 'password-should-be-32-characters',
            cookie: 'liberry',
            redirectTo: false,
            isSecure: false
        });
        server.auth.default('session');
    });

    server.route({
        method: 'GET',
        path: '/login',
        config: {
            handler: login,
            auth: false,
            plugins: {
                'hapi-auth-cookie': {
                    redirectTo: false
                }
            }
        }
    });

    server.route({
        method: 'GET',
        path: '/logout',
        config: {
            handler: logout
        }
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
