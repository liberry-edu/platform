'use strict';

const Boom = require('boom');
const RestHandler = require('../../helpers/rest_handler');

module.exports = class ModuleRestHandler extends RestHandler {
    constructor(model, contentModel) {
        super(model);
        this.contentModel = contentModel;
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
