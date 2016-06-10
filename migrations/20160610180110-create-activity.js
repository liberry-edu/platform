'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('activity', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      playlist_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      content_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      app_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      attr1: {
        type: Sequelize.STRING
      },
      attr2: {
        type: Sequelize.STRING
      },
      attr3: {
        type: Sequelize.STRING
      },
      attr4: {
        type: Sequelize.STRING
      },
      attr5: {
        type: Sequelize.STRING
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('activity');
  }
};
