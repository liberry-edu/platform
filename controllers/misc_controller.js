'use strict';
const DirTree = require('directory-tree');

var ready = function(server, next) {

    //API to get the directory tree of Liberry content to cerate a DB entry of the content
    server.route({
        method: 'GET',
        path: '/root/tree',
        config : {
            handler: function(request, reply) {
                reply(DirTree(server.env.content_root));
            },
            plugins: {'hapiAuthorization': {role: 'ADMIN'}}
        }
    });

    //API to get the directory tree of /media on pi to get the path to the pendrive
    if(server.env.mode == 'pi') {
        server.route({
            method: 'GET',
            path: '/drive/tree',
            config : {
                handler: function(request, reply) {
                    reply(DirTree('/media'));
                },
                plugins: {'hapiAuthorization': {role: 'ADMIN'}}
            }
        });
    }

    next();
}

exports.register = function (server, options, next) {
    server.dependency('auth', ready);
    next();
};

exports.register.attributes = {
    name : 'misc_controller'
};
