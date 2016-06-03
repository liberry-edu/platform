'use strict';
module.exports = function(sequelize, DataTypes) {
  var PlaylistContent = sequelize.define('playlist_content', {
    playlist_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    content_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    position: {
      type: DataTypes.INTEGER,
      allowNull: false,
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
  return PlaylistContent;
};
