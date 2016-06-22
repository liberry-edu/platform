'use strict';

module.exports = class ActivityService {
    constructor(model) {
        this.model = model;
    }

    getConsumedContentCount(userId, playlistId, callback) {
        this.model.aggregate('content_id', 'count', {
            distinct: true,
            where: {
                user_id: userId,
                playlist_id: playlistId
            }
        }).then(function(data) {
            callback(null, data);
        }).catch(function(err) {
            callback(err, null);
        });
    }

    isContentConsumedInPlaylist(userId, playlistId, contentId, callback) {
        this.model.aggregate('content_id', 'count', {
            distinct: true,
            where: {
                user_id: userId,
                playlist_id: playlistId,
                content_id: contentId
            }
        }).then(function(data) {
            callback(null, data != 0);
        }).catch(function(err) {
            callback(err, null);
        });
    }

    isContentConsumed(userId, contentId, callback) {
        this.model.aggregate('content_id', 'count', {
            distinct: true,
            where: {
                user_id: userId,
                content_id: contentId
            }
        }).then(function(data) {
            callback(null, data != 0);
        }).catch(function(err) {
            callback(err, null);
        });
    }
}
