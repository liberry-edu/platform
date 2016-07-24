'use strict';

const Bcrypt = require('bcrypt');
const async = require('async');
const Boom = require('boom');
const Joi = require('joi');

var ready = function(server, next) {

    server.route({
        method: 'POST',
        path: '/register',
        config: {
            description: "This endpoint is used to register a new user",
            notes: 'The created user details will be returned. This api can only be used to create users with role USER. Users have to be assigned role ADMIN directly in the database',
            tags: ["api"],
            validate: {
                    payload: {
                        username: Joi.string().required().description("The unique username for the user"),
                        password: Joi.string().required().description("The password for the user"),
                        name: Joi.string().description("Name of the user"),
                        email: Joi.string().email().description("Email of the user")
                    }
            },
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
                        });
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
                            });
                        });
                    }
                ], function(err, user) {
                    if(err) {
                        reply(Boom.badRequest(err));
                    }
                    else {
                        reply(user);
                    }
                });
            },
            auth: false,
            plugins: {'hapiAuthorization': false}
        }
    });

    server.route({
        method: 'GET',
        path: '/me',
        config: {
            description: "This endpoint is used to get logged in user's information",
            notes: 'The user info is returned at the time of login and hence this api should generally never be needed',
            tags: ["api"],
            handler: function(request, reply) {
                reply(request.auth.credentials);
            }
        }
    });

    server.route({
        method: 'POST',
        path: '/isValidUser',
        config: {
            description: "This endpoint is used to test if user credentials are correct",
            notes: 'The response will be a boolean',
            tags: ["api"],
            validate: {
                    payload: {
                        username: Joi.string().required().description("The unique username for the user"),
                        password: Joi.string().required().description("The password for the user"),
                    }
            },
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
                        });
                    },
                    function(user, callback) {
                        Bcrypt.compare(request.payload.password, user.password, (err, isValid) => {
                            if(err) {
                                err = Boom.badImplementation(err);
                            }
                            if(isValid) {
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
                });
            },
            auth: false,
            plugins: {'hapiAuthorization': false}
        }
    });

    next();
};

exports.register = function (server, options, next) {
    server.dependency('auth', ready);
    next();
};

exports.register.attributes = {
    name : 'user_controller'
};
