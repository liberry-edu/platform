'use strict';

const Boom = require('boom');
const DirTree = require('directory-tree');
const ActivityService = require('../service/activity_service');

var ready = function(server, next) {

    //API to get the directory tree of Liberry content to cerate a DB entry of the content
    server.route({
        method: 'GET',
        path: '/root/tree',
        config : {
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
}

exports.register = function (server, options, next) {
    server.dependency('auth', ready);
    next();
};

exports.register.attributes = {
    name : 'misc_controller'
};
