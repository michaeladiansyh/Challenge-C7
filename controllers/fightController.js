const { Room } = require("../models");

const ROCK = "R";
const PAPER = "P";
const SCISSOR = "S";

const WIN = "WIN";
const LOSE = "LOSE";
const DRAW = "DRAW";

const MAX_GAME = 3;

const checkRole = (user) => {
  const { asAdmin } = user;

  if (asAdmin !== false) {
    return false;
  }
  return true;
};

const checkGameComplete = (room) => {
  let result;
  if (room.choice1 && room.choice2) {
    if (room.choice1.length == MAX_GAME && room.choice2.length == MAX_GAME) {
      for (i = 0; i < MAX_GAME; i++) {
        if (
          (room.choice1[i] === ROCK && room.choice2[i] === ROCK) ||
          (room.choice1[i] === PAPER && room.choice2[i] === PAPER) ||
          (room.choice1[i] === SCISSOR && room.choice2[i] === SCISSOR)
        ) {
          result = DRAW;
        } else if (
          (room.choice1[i] === ROCK && room.choice2[i] === SCISSOR) ||
          (room.choice1[i] === PAPER && room.choice2[i] === ROCK) ||
          (room.choice1[i] === SCISSOR && room.choice2[i] === PAPER)
        ) {
          result = WIN;
        } else {
          result = LOSE;
        }
      }
      return true;
    }
  }
  return false;
};

const checkPlayerTurn = async (room, isFirstPlayer, isSecondPlayer) => {
  const { choice1, choice2 } = room;

  if (choice1 && choice2) {
    if (isFirstPlayer && choice1.length > choice2.length) {
      return false;
    } else if (isSecondPlayer && choice2.length >= choice1.length) {
      return false;
    }
  } else if (isFirstPlayer && choice1 && !choice2) {
    return false;
  } else if (isSecondPlayer && choice2 && !choice1) {
    return false;
  }
  return true;
};

// const checkGameResult = async (room) => {
//   const { choice1, choice2 } = room;
//   let scoreP1 = 0;
//   let scoreP2 = 0;
//   if (choice1 === choice2) {
//     return res.json("Result is ", DRAW);
//   } else if (
//     (choice1 == SCISSOR && choice2 == PAPER) ||
//     (choice1 == PAPER && choice2 == ROCK) ||
//     (choice1 == ROCK && choice2 == SCISSOR)
//   ) {
//     scoreP1 += 1;
//   } else if (
//     (choice2 == SCISSOR && choice1 == PAPER) ||
//     (choice2 == PAPER && choice1 == ROCK) ||
//     (choice2 == ROCK && choice1 == SCISSOR)
//   ) {
//     scoreP2 += 1;
//   }
//   if (scoreP1 > scoreP2) {
//     return res.json("Player 1 : ", WIN);
//   } else {
//     return res.json("Player 2 : ", WIN);
//   }
// };

const updatePlayer = async (room, userId) => {
  const { id: roomId } = room;

  let isFirstEmpty = false;
  let isSecondEmpty = false;

  let isFirstPlayer = false;
  let isSecondPlayer = false;

  if (room.player1 === userId) {
    isFirstPlayer = true;
  } else if (room.player2 === userId) {
    isSecondPlayer = true;
  } else if (room.player1 === null) {
    isFirstEmpty = true;
    isFirstPlayer = true;
  } else if (room.player2 === null) {
    isSecondEmpty = true;
    isSecondPlayer = true;
  } else if (room.player1 !== userId && room.player2 !== userId) {
    return { error: "Room Already full" };
  }

  if (isFirstEmpty) {
    try {
      await Room.update({ player1: userId }, { where: { id: roomId } });
    } catch (error) {
      return { error };
    }
  }

  if (isSecondEmpty) {
    try {
      await Room.update({ player2: userId }, { where: { id: roomId } });
    } catch (error) {
      return { error };
    }
  }

  return {
    isFirstEmpty,
    isSecondEmpty,
    isFirstPlayer,
    isSecondPlayer,
    error: null,
  };
};

const saveChoice = async (room, choice, isFirstPlayer, isSecondPlayer) => {
  const { id: roomId } = room;

  if (isFirstPlayer) {
    try {
      let updatePilihan = [];
      if (room.choice1) {
        room.choice1.push(choice);
        updatePilihan = [...room.choice1];
      } else if (!room.choice1) {
        updatePilihan.push(choice);
      }
      await Room.update({ choice1: updatePilihan }, { where: { id: roomId } });
    } catch (error) {
      return error;
    }
  }

  if (isSecondPlayer) {
    try {
      let updatePilihan = [];
      if (room.choice2) {
        room.choice2.push(choice);
        updatePilihan = [...room.choice2];
      } else if (!room.choice2) {
        updatePilihan.push(choice);
      }

      await Room.update({ choice2: updatePilihan }, { where: { id: roomId } });
    } catch (error) {
      return error;
    }
  }

  return { error: null };
};

const saveHistory = async (room) => {
  const { id: roomId } = room;
};

const game = async (req, res) => {
  const { choice } = req.body;

  const { id: userId } = req.user;

  const isPlayer = checkRole(req.user);

  if (!isPlayer) {
    return res.json("Role isn't allowed to play");
  }

  if (choice !== ROCK && choice !== PAPER && choice !== SCISSOR) {
    return res.json("Invalid Choice");
  }

  const { id: roomId } = req.params;

  let room = {};

  try {
    room = await Room.findOne({
      where: {
        id: roomId,
      },
    });
  } catch (error) {
    return res.json(error);
  }

  if (!room) {
    return res.json("Room not found");
  }

  const isGameComplete = checkGameComplete(room);
  //   const isCheckResult = await checkGameResult(room);

  if (isGameComplete) {
    return res.json("Game is already complete! ");
  }

  const {
    isFirstPlayer,
    isSecondPlayer,
    error: updateError,
  } = await updatePlayer(room, userId);
  if (updateError) {
    return res.json(updateError);
  }

  const isPlayerTurn = await checkPlayerTurn(
    room,
    isFirstPlayer,
    isSecondPlayer
  );
  if (!isPlayerTurn) {
    return res.json("Please wait for another player to choose!");
  }

  const { error: processError } = await saveChoice(
    room,
    choice,
    isFirstPlayer,
    isSecondPlayer
  );
  if (processError) {
    return res.json(processError);
  }

  let output = {};
  let roomUpdate = {};

  try {
    roomUpdate = await Room.findOne({
      where: { id: roomId },
    });
    output = { roomUpdate };
  } catch (error) {
    return res.json(error);
  }

  const lastGame = await checkGameComplete(roomUpdate);
  console.log("Cek games ", lastGame);
  if (lastGame) {
    output = {
      roomId,
      message: "Game Sudah Selesai",
    };
  }
  return res.json(output);
};

module.exports = {
  game,
};
