"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Room extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Room.init(
    {
      name: DataTypes.STRING,
      player1: DataTypes.INTEGER,
      player2: DataTypes.INTEGER,
      choice1: DataTypes.ARRAY(DataTypes.STRING),
      choice2: DataTypes.ARRAY(DataTypes.STRING),
    },
    {
      sequelize,
      modelName: "Room",
    }
  );
  return Room;
};
