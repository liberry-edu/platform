'use strict';

module.exports = class PlaylistService {
    constructor(playlistModel, playlistContentModel) {
        this.playlistModel = playlistModel;
        this.playlistContentModel = playlistContentModel;
    }

    getContentCount(playlistId, callback) {
        this.playlistContentModel.count({
            where: {
                playlist_id: playlistId
            }
        }).then(function(data) {
            callback(null, data);
        }).catch(function(err) {
            callback(err, null);
        });
    }
}
