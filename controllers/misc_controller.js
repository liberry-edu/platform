'use strict';

const Boom = require('boom');
const DirTree = require('directory-tree');
const ActivityService = require('../service/activity_service');
const Joi = require('joi');

var ready = function(server, next) {

    //API to get the directory tree of Liberry content to create a DB entry of the content
    server.route({
        method: 'GET',
        path: '/root/tree',
        config : {
            description: "This endpoint is used to get the json tree of content directory in LIBERRY_ROOT",
            notes: 'This is to be able to show the users a UI through which they can select a file on the server',
            tags: ["api"],
            handler: function(request, reply) {
                reply(DirTree(server.env.content_root));
            },
            plugins: {'hapiAuthorization': {role: 'ADMIN'}}
        }
    });

    //API to get the directory tree of /media on pi to get the path to the pendrive
    if(server.env.mode == 'pi') {
        server.route({
            method: 'GET',
            path: '/drive/tree',
            config : {
                description: "This endpoint is used to get the json tree of /media directory on pi",
                notes: 'This is to be able to show the users a UI through which they can select the pendrive on the pi',
                tags: ["api"],
                handler: function(request, reply) {
                    reply(DirTree('/media'));
                },
                plugins: {'hapiAuthorization': {role: 'ADMIN'}}
            }
        });
    }

    server.route({
        method: 'GET',
        path: '/consumed',
        config : {
            description: "This endpoint is used to get the count of consumed content for any playlist",
            notes: 'This is to be able to show the users the % of playlist they have watched',
            tags: ["api"],
            validate: {
                    query: {
                        playlist_id: Joi.number().integer().required().description("The playlist id")
                    }
            },
            handler: function(request, reply) {
                var activityService = new ActivityService(server.db.Activity);
                activityService.getConsumedContentCount(request.auth.credentials.id, request.query.playlist_id, function(err, data) {
                    if(err) {
                        return reply(Boom.badImplementation(err));
                    }
                    reply(data);
                });
            },
            plugins: {'hapiAuthorization': {role: ['ADMIN', 'USER']}}
        }
    });

    server.route({
        method: 'GET',
        path: '/isConsumed',
        config : {
            description: "This endpoint is used to know if a given content has been consumed from a given playlist",
            notes: 'The same content might have been consumed through some other playlist but the api will return false for such case',
            tags: ["api"],
            validate: {
                    query: {
                        playlist_id: Joi.number().integer().required().description("The playlist id"),
                        content_id: Joi.number().integer().required().description("The content id")
                    }
            },
            handler: function(request, reply) {
                var activityService = new ActivityService(server.db.Activity);
                activityService.isContentConsumed(request.auth.credentials.id, request.query.playlist_id, request.query.content_id, function(err, data) {
                    if(err) {
                        return reply(Boom.badImplementation(err));
                    }
                    reply(data);
                });
            },
            plugins: {'hapiAuthorization': {role: ['ADMIN', 'USER']}}
        }
    });

    next();
};

exports.register = function (server, options, next) {
    server.dependency('auth', ready);
    next();
};

exports.register.attributes = {
    name : 'misc_controller'
};
