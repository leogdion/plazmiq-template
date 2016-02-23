var Sequelize = require('sequelize');

module.exports = function (sequelize, DataTypes) {
  var Session = sequelize.define('Session', {
    id: {
      type: Sequelize.UUID,
      allowNull: false,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true
    }
  }, {
    classMethods: {
      associate: function (models) {
        Session.belongsTo(models.User);
      }
    }
  });

  return Session;
};