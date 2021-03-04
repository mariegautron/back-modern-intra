"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Company extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {

    }
  }
  Company.init(
    {
      name: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Company",
    }
  );

  Company.associate = (models) => {
    Company.hasMany(models.User);
    Company.hasMany(models.Account);
  };
  
  return Company;
};
