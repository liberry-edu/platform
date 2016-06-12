'use strict';
module.exports = function(sequelize, DataTypes) {
  var activity = sequelize.define('activity', {
    external_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    mac: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    playlist_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    content_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    app_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    attr1: DataTypes.STRING,
    attr2: DataTypes.STRING,
    attr3: DataTypes.STRING,
    attr4: DataTypes.STRING,
    attr5: DataTypes.STRING
  },
  {
    underscored: true,
    freezeTableName: true,
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return activity;
};
