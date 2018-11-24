module.exports = (sequelize, DataTypes) => {
  const userKey = sequelize.define('userKey', {
    token: DataTypes.STRING,
    userId: DataTypes.STRING,
  });
  return userKey;
};
