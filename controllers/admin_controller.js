'use strict';

const exec = require('child_process').exec;
const spawn = require('child_process').spawn;
const Boom = require('boom');
const fs = require('fs');

var exec_script= function(script, server, request, reply) {
    exec('./scripts/' + server.env.mode + '/' + script, (error, stdout, stderr) => {
        if(error) {
            reply(Boom.badImplementation(script + " script failed", error))
        }
        else {
            reply('Complete');
        }
    });
}

var spawn_script = function(script, reply) {
    spawn('./scripts/' + server.env.mode + '/' + script, [], {
        detached: true
    });
    reply('Complete');
}

var ready = function(server, next) {

    //Routes for Central server
    if(server.env.mode == 'central') {
        server.route({
            method: 'POST',
            path: '/syncdb',
            config: {
                payload: {
                    output: 'stream',
                    parse: true
                },
                handler: function(request, reply) {
                    var data = request.payload;
                    if (data.file) {
                        var name = data.file.hapi.filename + '.' + request.auth.credentials.username + '.' + Date.now();
                        var path = __dirname + "/../uploads/" + name;
                        var file = fs.createWriteStream(path);

                        file.on('error', function (err) {
                            console.error(err)
                        });

                        data.file.on('end', function (err) {
                            exec_script('syncdb.sh ' + path, server, request, reply);
                        });

                        data.file.pipe(file);
                    }
                },
                plugins: {'hapiAuthorization': {role: 'ADMIN'}}
            }
        });

        server.route({
            method: 'GET',
            path: '/download',
            config: {
                handler: function(request, reply) {
                    exec_script('download.sh ' + request.query.path, server, request, reply);
                },
                plugins: {'hapiAuthorization': {role: 'ADMIN'}}
            }
        });
    }
    //Routes for Pi server
    else {
        server.route({
            method: 'GET',
            path: '/upload',
            config: {
                handler: function(request, reply) {
                    exec_script('upload.sh ' + request.query.path, server, request, reply);
                },
                plugins: {'hapiAuthorization': {role: 'ADMIN'}}
            }
        });

        server.route({
            method: 'GET',
            path: '/syncdb',
            config: {
                handler: function(request, reply) {
                    exec_script('syncdb.sh ' + request.query.path, server, request, reply);
                },
                plugins: {'hapiAuthorization': {role: 'ADMIN'}}
            }
        });

        server.route({
            method: 'GET',
            path: '/download',
            config: {
                handler: function(request, reply) {
                    exec_script('download.sh ' + request.query.path + ' ' + server.mac, server, request, reply);
                },
                plugins: {'hapiAuthorization': {role: 'ADMIN'}}
            }
        });

        server.route({
            method: 'GET',
            path: '/restart',
            config: {
                handler: function(request, reply) {
                    spawn_script('restart.sh', reply);
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
    name : 'admin_controller'
};
