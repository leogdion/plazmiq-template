module.exports = function (sequelize, DataTypes) {
  var Permission = sequelize.define("permission", {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        is: /^[a-z][a-z0-9-]{5,15}$/
      }
    }
  });

  return Permission;
};