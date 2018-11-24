module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.createTable('userKeys', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      token: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      userId: {
        primaryKey: true,
        allowNull: false,
        type: Sequelize.INTEGER,
        unique: true,
        notEmpty: true,
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

  down: queryInterface => queryInterface.dropTable('userKeys'),
};
