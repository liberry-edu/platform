'use strict';

var ready = function(server, next) {
    var Sequelize = require('sequelize');
    var sequelize = new Sequelize(server.env.sequelize.database, server.env.sequelize.username, server.env.sequelize.password, {
        host: server.env.sequelize.host,
        dialect: server.env.sequelize.dialect,
        pool: {
          max: 5,
          min: 0,
          idle: 10000
        },
        storage: server.env.sequelize.storage
      });

      var db = {
        User : require('./user')(sequelize, Sequelize),
        Category : require('./category')(sequelize, Sequelize),
        Module : require('./module')(sequelize, Sequelize),
        Content : require('./content')(sequelize, Sequelize),
        Playlist : require('./playlist')(sequelize, Sequelize),
        PlaylistContent : require('./playlistcontent')(sequelize, Sequelize),
        Device : require('./device')(sequelize, Sequelize),
        Location : require('./location')(sequelize, Sequelize),
        App : require('./app')(sequelize, Sequelize),
        Activity : require('./activity')(sequelize, Sequelize)
      }

    server.decorate('server', 'db', db);
    next();
};

exports.register = function (server, options, next) {
    server.dependency('env', ready);
    next();
};

exports.register.attributes = {
    name : 'db'
};
