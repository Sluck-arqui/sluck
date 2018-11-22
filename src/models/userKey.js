module.exports = (sequelize, DataTypes) => {
  const userKey = sequelize.define('userKey', {
    token: DataTypes.STRING,
    userId: { type: DataTypes.STRING, primaryKey: true },
  }, {
    timestamps: false,
    freezeTableName: true,
  });
  return userKey;
};
