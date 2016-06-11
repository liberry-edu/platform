'use strict';

var ready = function(server, next) {
    const Bcrypt = require('bcrypt');
    const async = require('async');
    const Boom = require('boom');

    server.route({
        method: 'POST',
        path: '/register',
        config: {
            handler: function(request, reply) {
                async.waterfall([
                    function(callback) {
                        server.db.User.findOne({
                            where: {
                              username: request.payload.username
                            }
                        }).then(function(user) {
                            if(user) {
                                callback("User with given username already exists", user);
                            }
                            else {
                                callback(null);
                            }
                        })
                    },
                    function(callback) {
                        Bcrypt.hash(request.payload.password, 8 , function(err, hash) {
                            request.payload.role = "USER";
                            request.payload.status = "active";
                            request.payload.password = hash;
                            request.payload.mac = server.mac;
                            server.db.User.create(request.payload).then(function(user) {
                                callback(null, user);
                            }).catch(function(err) {
                                callback(err, null);
                            })
                        });
                    }
                ], function(err, user) {
                    if(err) {
                        reply(Boom.badRequest(err));
                    }
                    else {
                        reply(user);
                    }
                })
            },
            auth: false,
            plugins: {'hapiAuthorization': false}
        }
    });

    server.route({
        method: 'GET',
        path: '/me',
        handler: function(request, reply) {
            reply(request.auth.credentials);
        }
    });

    server.route({
        method: 'POST',
        path: '/isValidUser',
        config: {
            handler: function(request, reply) {
                async.waterfall([
                    function(callback) {
                        server.db.User.findOne({
                            where: {
                              username: request.payload.username
                            }
                        }).then(function(user) {
                            if(user) {
                                callback(null, user);
                            }
                            else {
                                return reply(false);
                            }
                        })
                    },
                    function(user, callback) {
                        Bcrypt.hash(request.payload.password, 8 , function(err, hash) {
                            if(hash == user.password) {
                                return reply(true);
                            }
                            else {
                                return reply(false);
                            }
                        });
                    }
                ], function(err, user) {
                    if(err) {
                        reply(Boom.badRequest(err));
                    }
                    else {
                        reply(true);
                    }
                })
            },
            auth: false,
            plugins: {'hapiAuthorization': false}
        }
    })

    next();
}

exports.register = function (server, options, next) {
    server.dependency('auth', ready);
    next();
};

exports.register.attributes = {
    name : 'user_controller'
};
