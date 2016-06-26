'use strict';

const Boom = require('boom');
const Async = require('async');
const RestHandler = require('../../helpers/rest_handler');

module.exports = class PlaylistRestHandler extends RestHandler {
    constructor(model, playlistContentModel, contentModel) {
        super(model);
        this.playlistContentModel = playlistContentModel;
        this.contentModel = contentModel;
    }

    readOne(request, reply) {
        var that = this;
        this.model.findOne({
            where: {
                id: request.params.id
            }
        }).then(function(data) {
            data = data.get({plain: true});
            that.playlistContentModel.findAll({
                where: {
                    playlist_id : request.params.id
                },
                order: 'position ASC'
            }).then(function(content_list) {
                var content = [];
                Async.forEachOf(content_list, function(datum, index, callback) {
                    that.contentModel.findOne({
                        where: {
                            id: datum.content_id
                        }
                    }).then(function(content_data) {
                        content.push(content_data);
                        callback(null);
                    }).catch(function(err) {
                        callback(err);
                    });
                }, function(err) {
                    if(err) {
                        return reply(Boom.badImplementation(err));
                    }
                    data.content = content;
                    reply(data);
                });
            }).catch(function(err) {
                reply(Boom.badImplementation(err));
            });
        }).catch(function(err) {
            reply(Boom.badImplementation(err));
        })
    }
}
