'use strict';
module.exports = function(sequelize, DataTypes) {
  var Category = sequelize.define('category', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: DataTypes.STRING,
    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    image: DataTypes.STRING
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
  return Category;
};
