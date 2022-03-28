const Room = require("../models").Room;
const response = require("../helpers/response");

const checkRole = (user) => {
  const { asAdmin } = user;

  if (asAdmin !== true) {
    return false;
  }
  return true;
};

const createRoom = async (req, res) => {
  try {
    const { name } = req.body;
    const isPlayer = checkRole(req.user);

    //check role user apakah bisa membuat room
    if (!isPlayer) {
      return response(
        res,
        400,
        false,
        "Role is not allowed to create room",
        isPlayer
      );
    }
    //check room apakah sudah ada?

    const checkRoom = await Room.findOne({
      where: {
        name: name,
      },
    });

    if (checkRoom) {
      return response(res, 400, false, "Room already Registered", checkRoom);
    }

    const room = await Room.create({
      name,
    });
    return response(res, 201, true, "Room Created", room);
  } catch (error) {
    return response(res, 500, false, "Internal Server Error", error);
  }
};

module.exports = {
  createRoom,
};
