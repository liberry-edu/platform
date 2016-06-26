'use strict';

const Boom = require('boom');
const Async = require('async');
const RestHandler = require('../../helpers/rest_handler');
const ActivityService = require('../../service/activity_service');
const PlaylistService = require('../../service/playlist_service');

module.exports = class ContentRestHandler extends RestHandler {
    constructor(db) {
        super(db.Content);
        this.activityService = new ActivityService(db.Activity);
        this.playlistService = new PlaylistService(db.Playlist, db.PlaylistContent);
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
                that.activityService.isContentConsumed(request.auth.credentials.id, datum.id, function(err, consumed) {
                    data[index]['consumed'] = consumed;
                    callback(err);
                });
            }, function(err) {
                if(err) {
                    return reply(Boom.badImplementation(err));
                }
                reply(data);
            });
        }).catch(function(err) {
            reply(Boom.badImplementation(err));
        })
    }
}
