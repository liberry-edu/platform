'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('app', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      description: {
        type: Sequelize.STRING
      },
      status: {
        type: Sequelize.STRING,
        allowNull: false
      },
      url: {
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
      return queryInterface.addIndex('app', ['name'], {indicesType: 'UNIQUE'}).then(function() {
          return queryInterface.addIndex('app', ['url'], {indicesType: 'UNIQUE'});
      });
  });
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('app');
  }
};
