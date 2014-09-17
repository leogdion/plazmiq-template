module.exports = function (sequelize, DataTypes) {
  //var App = sequelize.$('app');
  var Registration = sequelize.define("registration", {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true
      }
    },
    key: {
      type: DataTypes.BLOB('tiny'),
      allowNull: false
    },
    secret: {
      type: DataTypes.BLOB('tiny'),
      allowNull: false
    },
    registeredAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  }, {
    classMethods: {
      associate: function (models) {
        Registration.belongsTo(models.app);
      }
    }
  });

  //
  return Registration;
};