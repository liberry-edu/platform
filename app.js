'use strict';

const Hapi = require('hapi');
const Inert = require('inert');
const Db = require('./models/db');
const Auth = require('./middleware/cookie_auth');
const Mac = require('./middleware/mac');
const Env = require('./middleware/env');
const UserController = require('./controllers/user_controller');
const AdminController = require('./controllers/admin_controller');
const RestController = require('./controllers/rest_controller');
const StaticController = require('./controllers/static_controller');
const MiscController = require('./controllers/misc_controller');

//Check all required env variables are set or not
if(!(process.env.LIBERRY_ROOT)) {
    console.error("All required env variables are not set. Required env variables are : LIBERRY_ROOT");
    process.exit(-1);
}

// Create a server with a host and port
const server = new Hapi.Server();
server.connection({
    host: process.env.HOST || 'localhost',
    port: process.env.PORT || 8080,
    routes: {
		plugins: {
			hapiAuthorization: { roles: ['ADMIN', 'USER'] }
		}
	}
});

var plugins = [
    {
        register: Inert,
        options: {}
    },
    {
        register: Db,
        options: {}
    },
    {
        register: Auth,
        options: {}
    },
    {
        register: Mac,
        options: {}
    },
    {
        register: Env,
        options: {}
    },
    {
        register: UserController,
        options: {}
    },
    {
        register: AdminController,
        options: {}
    },
    {
        register: RestController,
        options: {}
    },
    {
        register: StaticController,
        options: {}
    },
    {
        register: MiscController,
        options: {}
    }];

//Register plugins
server.register(plugins, (err) => {
    if(err) {
        throw(err);
    }

    // Start the server
    server.start((err) => {
        if (err) {
            throw err;
        }
        console.log('The mode is:', server.env.mode);
        console.log('Server running at:', server.info.uri);
    });
});
