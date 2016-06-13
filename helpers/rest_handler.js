'use strict';

const Boom = require('boom');

module.exports = class RestHandler {
    constructor(model) {
        this.model = model
    }

    create(request, reply) {
        request.payload.status = "active";
        this.model.create(request.payload).then(function(data) {
            reply(data);
        }).catch(function(err) {
            reply(Boom.badRequest(err));
        })
    }

    readOne(request, reply) {
        this.model.findOne({
            where: {
                id: request.params.id
            }
        }).then(function(data) {
            reply(data);
        }).catch(function(err) {
            reply(Boom.badImplementation(err));
        })
    }

    readAll(request, reply) {
        var options = {};
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
        this.model.findAll(options).then(function(data) {
            reply(data);
        }).catch(function(err) {
            reply(Boom.badImplementation(err));
        })
    }

    update(request, reply) {
        this.model.update(request.payload, {
            where: {
                id: request.params.id
            }
        }).then(function(data) {
            reply(data);
        }).catch(function(err) {
            reply(Boom.badImplementation(err));
        })
    }

    delete(request, reply) {
        this.model.update({
            status: 'deleted'
        }, {
            where: {
                id: request.params.id
            }
        }).then(function(data) {
            reply(data);
        }).catch(function(err) {
            reply(Boom.badImplementation(err));
        })
    }
}
