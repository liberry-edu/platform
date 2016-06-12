'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
      return queryInterface.createTable('user', {
          id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
          },
          external_id: {
            allowNull: true,
            type: Sequelize.INTEGER
          },
          mac: {
            type: Sequelize.STRING,
            allowNull: false
          },
          name: {
            type: Sequelize.STRING,
            allowNull: false
          },
          username: {
            type: Sequelize.STRING,
            allowNull: false
          },
          email: {
            type: Sequelize.STRING
          },
          password: {
            type: Sequelize.STRING,
            allowNull: false
          },
          role: {
            type: Sequelize.STRING,
            allowNull: false
          },
          status: {
            type: Sequelize.STRING,
            allowNull: false
          },
          created_at: {
            allowNull: false,
            type: Sequelize.DATE
          },
          updated_at: {
            allowNull: false,
            type: Sequelize.DATE
          }
        }).then(function() {
            if(process.env.MODE == 'central') {
                return queryInterface.addIndex('user', ['username']).then(function() {
                    return queryInterface.addIndex('user', ['external_id', 'mac'], {indicesType: 'UNIQUE'});
                });
            }
            else {
                return queryInterface.addIndex('user', ['username']);
            }
        });

    },

  down: function (queryInterface, Sequelize) {
      return queryInterface.dropTable('user');
  }
};
