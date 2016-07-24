'use strict';

const Boom = require('boom');
const Async = require('async');
const RestHandler = require('../../helpers/rest_handler');
const ActivityService = require('../../service/activity_service');
const PlaylistService = require('../../service/playlist_service');

module.exports = class ModuleRestHandler extends RestHandler {
    constructor(db) {
        super(db.Module);
        this.contentModel = db.Content;
        this.activityService = new ActivityService(db.Activity);
        this.playlistService = new PlaylistService(db.Playlist, db.PlaylistContent);
    }

    readOne(request, reply) {
        var that = this;
        this.model.findOne({
            where: {
                id: request.params.id
            }
        }).then(function(data) {
            that.contentModel.findAll({
                where: {
                    module_id : request.params.id
                }
            }).then(function(content) {
                var cleanData = data.get({plain: true});
                cleanData.content = content;
                reply(cleanData);
            }).catch(function(err) {
                reply(Boom.badImplementation(err));
            });
        }).catch(function(err) {
            reply(Boom.badImplementation(err));
        });
    }

    readAll(request, reply) {
        var that = this;
        var options = {};
        try {
            if(request.query.offset) {
                options.offset = parseInt(request.query.offset);
            }
            if(request.query.limit) {
                options.limit = parseInt(request.query.limit);
            }
            if(request.query.filters) {
                options.where = JSON.parse(request.query.filters);
            }
            if(request.query.sortField && request.query.sortDir) {
                options.order = request.query.sortField + " " + request.query.sortDir;
            }
        }
        catch(err) {
            return reply(Boom.badRequest(err));
        }
        this.model.findAll(options).then(function(data) {
            Async.forEachOf(data, function(datum, index, callback) {
                data[index] = data[index].get({plain: true});
                that.activityService.getConsumedContentCount(request.auth.credentials.id, datum.default_playlist_id, function(err1, count) {
                    data[index].media_consumed = count;
                    that.playlistService.getContentCount(datum.default_playlist_id, function(err2, total) {
                        data[index].media_total = total;
                        callback(err1 || err2);
                    });
                });
            }, function(err) {
                if(err) {
                    return reply(Boom.badImplementation(err));
                }
                reply(data);
            });
        }).catch(function(err) {
            reply(Boom.badImplementation(err));
        });
    }
};
