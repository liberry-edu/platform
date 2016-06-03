'use strict';

const RestHandler = require('../helpers/rest_handler');
const ModuleRestHandler = require('./handlers/module_rest_handler');
const PlaylistRestHandler = require('./handlers/playlist_rest_handler');

var ready = function(server, next) {
    const categoryHandler = new RestHandler(server.db.Category);
    register(server, '/categories', categoryHandler);

    const moduleHandler = new ModuleRestHandler(server.db.Module, server.db.Content);
    register(server, '/modules', moduleHandler);

    const playlistHandler = new PlaylistRestHandler(server.db.Playlist, server.db.PlaylistContent);
    register(server, '/playlists', playlistHandler);

    const contentHandler = new RestHandler(server.db.Content);
    register(server, '/contents', contentHandler);

    const playlistContentHandler = new RestHandler(server.db.PlaylistContent);
    register(server, '/playlist_contents', playlistContentHandler);

    const deviceHandler = new RestHandler(server.db.Device);
    register(server, '/devices', deviceHandler);

    const locationHandler = new RestHandler(server.db.Location);
    register(server, '/locations', locationHandler);

    next();
}

var register = function(server, endpoint, handler) {

    server.route({
        method: 'POST',
        path: endpoint,
        config: {
            handler: function(request, reply) {
                handler.create(request, reply);
            },
            plugins: {'hapiAuthorization': ['ADMIN']}
        }
    });

    server.route({
        method: 'GET',
        path: endpoint,
        config: {
            handler: function(request, reply) {
                handler.readAll(request, reply);
            },
            plugins: {'hapiAuthorization': ['ADMIN', 'USER']}
        }
    });

    server.route({
        method: 'GET',
        path: endpoint + '/{id}',
        config: {
            handler: function(request, reply) {
                handler.readOne(request, reply);
            },
            plugins: {'hapiAuthorization': ['ADMIN', 'USER']}
        }
    });

    server.route({
        method: 'PUT',
        path: endpoint + '/{id}',
        config: {
            handler: function(request, reply) {
                handler.update(request, reply);
            },
            plugins: {'hapiAuthorization': ['ADMIN']}
        }
    });

    server.route({
        method: 'DELETE',
        path: endpoint + '/{id}',
        config: {
            handler: function(request, reply) {
                handler.delete(request, reply);
            },
            plugins: {'hapiAuthorization': ['ADMIN']}
        }
    });
}

exports.register = function (server, options, next) {
    server.dependency('auth', ready);
    next();
};

exports.register.attributes = {
    name : 'rest_controller'
};
