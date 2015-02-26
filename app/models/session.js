/*
var constants = {
  renewal: 5 * 60 * 1000,
  expiration: 7 * 24 * 60 * 60 * 1000
};
*/

module.exports = function (sequelize, DataTypes) {
  var Session = sequelize.define("session", {
/*
    key: {
      type: DataTypes.BLOB('tiny'),
      allowNull: false
    },
    clientIpAddress: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIPv4: true
      }
    },
    startedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    lastActivatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    endedAt: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    instanceMethods: {
      renew: function () {
        return this.updateAttributes({
          'lastActivatedAt': new Date()
        }, ['lastActivatedAt']);
      },
      logoff: function () {
        return this.updateAttributes({
          'endedAt': new Date()
        }, ['endedAt']);
      }
    },
    classMethods: {
      associate: function (models) {
        Session.belongsTo(models.user).belongsTo(models.app).belongsTo(models.device);
      },
      constants: function () {
        return constants;
      }
    }
*/
  });

  //Session.belongsTo(User).belongsTo(App).belongsTo(Device);
  return Session;
};
