'use strict';

const exec = require('child_process').exec;
const spawn = require('child_process').spawn;
const Boom = require('boom');
const fs = require('fs');
const Joi = require('joi');

var exec_script= function(script, server, request, reply) {
    exec('./scripts/' + server.env.mode + '/' + script, (error, stdout, stderr) => {
        if(error) {
            reply(Boom.badImplementation(script + " script failed", error));
        }
        else {
            reply('Complete');
        }
    });
};

var spawn_script = function(script, server, request, reply) {
    spawn('./scripts/' + server.env.mode + '/' + script, [], {
        detached: true
    });
    reply('Complete');
};

var ready = function(server, next) {

    //Routes for Central server
    if(server.env.mode == 'central') {
        server.route({
            method: 'POST',
            path: '/syncdb',
            config: {
                description: "This endpoint is used to upload a SQL file gotten from pi to the central server and have its content synced to the central database",
                notes: 'The api will take any sql file and run it against the central server, though it is meant to import users data from pi to central server',
                tags: ["api"],
                validate: {
                        payload: {
                            file: Joi.any().required().meta({ swaggerType: 'file' }).description('The SQL file to be uploaded')
                        }
                },
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
                            console.error(err);
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
                description: "This endpoint is used to dump the SQL tables on the central server to the output directory of LIBERRY_ROOT",
                notes: 'The api does not download the files to the users computer. They are still on the server and need to be downloaded through scp when creating pendrive',
                tags: ["api"],
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
                description: "This endpoint is used to copy the new code and content from pendrive to pi",
                notes: 'The api expects the path of the LIBERRY_ROOT on pendrive to be provided and then it will copy the content from then to LIBERRY_ROOT',
                tags: ["api"],
                validate: {
                        query: {
                            path: Joi.string().required().description('The path of LIBERRY_ROOT on pendrive')
                        }
                },
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
                description: "This endpoint is used to import the SQL files on the pendrive into the database",
                notes: 'The api expects the path of the LIBERRY_ROOT on pendrive to be provided and then it will import all SQL files present in output/central/ directory',
                tags: ["api"],
                validate: {
                        query: {
                            path: Joi.string().required().description('The path of LIBERRY_ROOT on pendrive')
                        }
                },
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
                description: "This endpoint is used to dump the SQL tables on the pi server to the output directory of LIBERRY_ROOT on the pendrive",
                notes: 'The api copies the files to the pendrive',
                tags: ["api"],
                validate: {
                        query: {
                            path: Joi.string().required().description('The path of LIBERRY_ROOT on pendrive')
                        }
                },
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
                description: "This endpoint is used to restart the server on the pi because new code might have been uploaded",
                notes: 'The server would die for sometime and then on hitting refresh on the browser should come back to life',
                tags: ["api"],
                handler: function(request, reply) {
                    spawn_script('restart.sh', server, request, reply);
                },
                plugins: {'hapiAuthorization': {role: 'ADMIN'}}
            }
        });

    }

    next();
};

exports.register = function (server, options, next) {
    server.dependency('auth', ready);
    next();
};

exports.register.attributes = {
    name : 'admin_controller'
};
