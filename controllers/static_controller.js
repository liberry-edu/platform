'use strict';

var ready = function(server, next) {

    server.route({
        method: 'GET',
        path: '/{param*}',
        config : {
            handler: {
                directory: {
                    path: ['public/' + server.env.mode, 'node_modules']
                }
            },
            auth: false
        }
    });

    // server.route({
    //     method: 'GET',
    //     path: '/',
    //     config : {
    //         handler: {
    //             file: 'public/'  + server.env.mode + '/html/index.html'
    //         },
    //         auth: false
    //     }
    // });

    server.route({
        method: 'GET',
        path: '/',
        config : {
            handler: function(request, reply) {
                if (request.auth.isAuthenticated) {
                    if(request.auth.credentials.role == 'USER') {
                        return reply.redirect('/dashboard/user');
                    }
                    else {
                        return reply.redirect('/dashboard/admin');
                    }
                }
                else {
                    return reply.file('login.html');
                }
            },
            auth: false
        }
    });

    server.route({
        method: 'GET',
        path: '/dashboard/admin',
        config : {
            handler: {
                file: 'public/'  + server.env.mode + '/html/admin.html'
            },
            plugins: {'hapiAuthorization': {role: 'ADMIN'}}
        }
    });

    server.route({
        method: 'GET',
        path: '/dashboard/user',
        config : {
            handler: {
                file: 'public/'  + server.env.mode + '/html/user.html'
            },
        }
    });

    next();
}

exports.register = function (server, options, next) {
    server.dependency('auth', ready);
    next();
};

exports.register.attributes = {
    name : 'static_controller'
};
