'use strict';

const Boom = require('boom');
const Async = require('async');
const RestHandler = require('../../helpers/rest_handler');
const ActivityService = require('../../service/activity_service');

module.exports = class PlaylistRestHandler extends RestHandler {
    constructor(db) {
        super(db.Playlist);
        this.playlistContentModel = db.PlaylistContent;
        this.contentModel = db.Content;
        this.activityService = new ActivityService(db.Activity);
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
                        content_data = content_data.get({plain: true});
                        that.activityService.isContentConsumed(request.auth.credentials.id, content_data.id, function(err, consumed) {
                            content_data['consumed'] = consumed;
                            content.push(content_data);
                            callback(err);
                        });
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
