const { User } = require("../models");
const bcrypt = require("bcryptjs");
const response = require("../helpers/response");

const format = (user) => {
  const { id, username, asAdmin } = user;
  console.log(user);
  return {
    id,
    username,
    asAdmin,
    accessToken: user.generateToken(),
  };
};

const register = async (req, res) => {
  try {
    const { username, password, asAdmin } = req.body;

    //checking role
    if (asAdmin !== true && asAdmin !== false) {
      return res.json("Role is Not Allowed!");
    }

    const checkUser = await User.findOne({
      where: {
        username: username,
      },
    });

    if (checkUser) {
      return response(res, 400, false, "User already Registered");
    }
    const user = await User.create({
      username,
      password,
      asAdmin,
    });
    return response(res, 201, true, "User Created!", user);
  } catch (error) {
    return response(res, 500, false, "Internal Server Error!");
  }
};

const login = async (req, res) => {
  const { username, password } = req.body;
  let user = {};
  try {
    user = await User.findOne({
      where: { username: username },
    });
    if (!user) {
      return response(res, 400, false, "Username doesn't exist");
    }
    const isPassword = bcrypt.compareSync(password, user.password);
    if (!isPassword) {
      return response(res, 400, false, "Password is Wrong!");
    }
    return response(res, 200, true, "Success Login", format(user));
  } catch (error) {
    return response(res, 500, false, "Internal Server Error");
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    return response(res, 200, true, "List Users Found", users);
  } catch (error) {
    return response(res, 500, false, "Internal Server Error", error);
  }
};

module.exports = {
  register,
  login,
  getUsers,
};
