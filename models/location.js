'use strict';
module.exports = function(sequelize, DataTypes) {
  var Location = sequelize.define('Location', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    line1: DataTypes.STRING,
    line2: DataTypes.STRING,
    state: DataTypes.STRING,
    country: DataTypes.STRING,
    pin: DataTypes.INTEGER
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
  return Location;
};
