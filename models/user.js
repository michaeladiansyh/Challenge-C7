"use strict";
const { Model } = require("sequelize");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
    generateToken = () => {
      const payload = {
        id: this.id,
        username: this.username,
      };
      const secret = "This is Secret";
      const token = jwt.sign(payload, secret, { expiresIn: 60 * 5 });
      return token;
    };
  }
  User.init(
    {
      username: { type: DataTypes.STRING, unique: true },
      password: { type: DataTypes.STRING, validate: { notEmpty: true } },
      asAdmin: { type: DataTypes.BOOLEAN, defaultValue: false },
    },
    {
      sequelize,
      modelName: "User",
      hooks: {
        beforeCreate: (instance) => {
          const salt = bcrypt.genSaltSync(10);
          instance.password = bcrypt.hashSync(instance.password, salt);
        },
      },
    }
  );
  return User;
};
