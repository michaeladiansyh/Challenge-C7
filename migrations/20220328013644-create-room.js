"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Rooms", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING,
      },
      player1: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: "Users",
            schema: "public",
          },
          key: "id",
        },
      },
      player2: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: "Users",
            schema: "public",
          },
          key: "id",
        },
      },
      choice1: {
        type: Sequelize.ARRAY(Sequelize.STRING),
      },
      choice2: {
        type: Sequelize.ARRAY(Sequelize.STRING),
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Rooms");
  },
};
