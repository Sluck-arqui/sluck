module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.createTable('userKey', {
      token: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      userId: {
        primaryKey: true,
        allowNull: false,
        type: Sequelize.STRING,
        unique: true,
        notEmpty: true,
      },
    });
  },
  down(queryInterface, Sequelize) {
  },
};
