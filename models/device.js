'use strict';
module.exports = function(sequelize, DataTypes) {
  var Device = sequelize.define('device', {
    mac: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    location_id: DataTypes.INTEGER
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
  return Device;
};
