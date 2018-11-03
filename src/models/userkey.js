module.exports = (sequelize, DataTypes) => {
  const UserKey = sequelize.define('UserKey', {
    token: DataTypes.STRING,
    userId: DataTypes.STRING,
  });
  return UserKey;
};
