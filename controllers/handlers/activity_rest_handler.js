'use strict';

const Boom = require('boom');
const RestHandler = require('../../helpers/rest_handler');

module.exports = class ActivityRestHandler extends RestHandler {

    create(request, reply) {
        request.payload.mac = request.server.mac;
        request.payload.user_id = request.auth.credentials.id;
        this.model.create(request.payload).then(function(data) {
            reply(data);
        }).catch(function(err) {
            reply(Boom.badRequest(err));
        })
    }
}
