'use strict';

const Boom = require('boom');
const RestHandler = require('../../helpers/rest_handler');

module.exports = class PlaylistRestHandler extends RestHandler {
    constructor(model, playlistContentModel) {
        super(model);
        this.playlistContentModel = playlistContentModel;
    }

    readOne(request, reply) {
        var that = this;
        this.model.findOne({
            where: {
                id: request.params.id
            }
        }).then(function(data) {
            that.playlistContentModel.findAll({
                where: {
                    playlist_id : request.params.id
                }
            }).then(function(content) {
                data.content = content;
                reply(data);
            }).catch(function(err) {
                reply(Boom.badImplementation(err));
            })
        }).catch(function(err) {
            reply(Boom.badImplementation(err));
        })
    }
}
