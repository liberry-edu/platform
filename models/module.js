'use strict';
module.exports = function(sequelize, DataTypes) {
  var Module = sequelize.define('module', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: DataTypes.STRING,
    image: DataTypes.STRING,
    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    parent_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    default_playlist_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    }
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
  return Module;
};
