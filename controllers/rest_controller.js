'use strict';

const Joi = require('joi');
const RestHandler = require('../helpers/rest_handler');
const ModuleRestHandler = require('./handlers/module_rest_handler');
const PlaylistRestHandler = require('./handlers/playlist_rest_handler');
const ActivityRestHandler = require('./handlers/activity_rest_handler');
const ContentRestHandler = require('./handlers/content_rest_handler');

const readPermissions = [
    ['ADMIN'],
    ['ADMIN', 'USER'],
    ['ADMIN', 'USER'],
    ['ADMIN'],
    ['ADMIN']
];

const writePermissions = [
    ['ADMIN', 'USER'],
    ['ADMIN', 'USER'],
    ['ADMIN', 'USER'],
    ['ADMIN', 'USER'],
    ['ADMIN']
];

const deletePermissions = [
    ['ADMIN', 'USER'],
    ['ADMIN', 'USER'],
    ['ADMIN', 'USER'],
    ['ADMIN', 'USER'],
    ['ADMIN', 'USER']
];

var ready = function(server, next) {
    const categoryHandler = new RestHandler(server.db.Category);
    register(server, '/categories', categoryHandler);

    const moduleHandler = new ModuleRestHandler(server.db);
    register(server, '/modules', moduleHandler);

    const playlistHandler = new PlaylistRestHandler(server.db);
    register(server, '/playlists', playlistHandler);

    const contentHandler = new ContentRestHandler(server.db);
    register(server, '/contents', contentHandler);

    const playlistContentHandler = new RestHandler(server.db.PlaylistContent);
    register(server, '/playlist_contents', playlistContentHandler);

    const deviceHandler = new RestHandler(server.db.Device);
    register(server, '/devices', deviceHandler);

    const locationHandler = new RestHandler(server.db.Location);
    register(server, '/locations', locationHandler);

    const appHandler = new RestHandler(server.db.App);
    register(server, '/apps', appHandler);

    const activityHandler = new ActivityRestHandler(server.db);
    register(server, '/activities', activityHandler, writePermissions);

    next();
};

var register = function(server, endpoint, handler, permissions) {

    if(!permissions) {
        permissions = readPermissions;
    }

    server.route({
        method: 'POST',
        path: endpoint,
        config: {
            description: "This endpoint is used to create the resource",
            notes: 'The created resource details will be returned.',
            tags: ["api"],
            validate: {
                    payload: {
                    }
            },
            handler: function(request, reply) {
                handler.create(request, reply);
            },
            plugins: {
                'hapiAuthorization': permissions[0],
                'hapi-swagger': {
                    payloadType: 'json'
                }
            }
        }
    });

    server.route({
        method: 'GET',
        path: endpoint,
        config: {
            description: "This endpoint is used to get the collection of resource",
            notes: 'All available resource details will be returned',
            tags: ["api"],
            validate: {
                    query: {
                        offset: Joi.number().integer().description("The number of records to skip"),
                        limit: Joi.number().integer().description("The number of records to fetch"),
                        sortField: Joi.string().description("The field to sort on"),
                        sortDir: Joi.string().description("The direction to sort (ASC, DESC)"),
                        filters: Joi.object().description("The direction to sort (ASC, DESC)"),
                    }
            },
            handler: function(request, reply) {
                handler.readAll(request, reply);
            },
            plugins: {'hapiAuthorization': permissions[1]}
        }
    });

    server.route({
        method: 'GET',
        path: endpoint + '/{id}',
        config: {
            description: "This endpoint is used to get one resource",
            notes: 'Resource details will be returned',
            tags: ["api"],
            validate: {
                    params: {
                        id: Joi.number().integer().description("The id of the resource")
                    }
            },
            handler: function(request, reply) {
                handler.readOne(request, reply);
            },
            plugins: {'hapiAuthorization': permissions[2]}
        }
    });

    server.route({
        method: 'PUT',
        path: endpoint + '/{id}',
        config: {
            description: "This endpoint is used to update one resource",
            notes: 'Resource details will be returned',
            tags: ["api"],
            validate: {
                    params: {
                        id: Joi.number().integer().description("The id of the resource")
                    },
                    payload: {

                    }
            },
            handler: function(request, reply) {
                handler.update(request, reply);
            },
            plugins: {'hapiAuthorization': permissions[3]}
        }
    });

    server.route({
        method: 'DELETE',
        path: endpoint + '/{id}',
        config: {
            description: "This endpoint is used to delete one resource",
            notes: 'Resource details will be returned',
            tags: ["api"],
            validate: {
                    params: {
                        id: Joi.number().integer().description("The id of the resource")
                    }
            },
            handler: function(request, reply) {
                handler.delete(request, reply);
            },
            plugins: {'hapiAuthorization': permissions[4]}
        }
    });
};

exports.register = function (server, options, next) {
    server.dependency('auth', ready);
    next();
};

exports.register.attributes = {
    name : 'rest_controller'
};
