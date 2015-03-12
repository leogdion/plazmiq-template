var crypto = require('crypto'),
    QueryChainer = require('sequelize').Utils.QueryChainer,
    UserAgent;

module.exports = function (sequelize, DataTypes) {

  var Device = sequelize.define("device", {
    key: {
      type: DataTypes.BLOB('tiny'),
      allowNull: false
    }
  }, {
    classMethods: {
      findByKey: function (key, userAgent, cb) {
        var keyBuffer;
        if (key) {
          keyBuffer = new Buffer(key, 'base64');
        } else {
          keyBuffer = crypto.randomBytes(48);
        }
        Device.find({
          where: {
            key: keyBuffer
          }
        }).then(
          function (device) {
            var chainer = new QueryChainer();
            chainer.add(Device.create({
              key: keyBuffer
            }));
            chainer.add(UserAgent.findOrCreate({
              where : {text: userAgent}
            }));
            chainer.run().success(function (results) {              
              results[0].setUserAgent(results[1][0]).then(cb);
            });
          }
        );
      },
      associate: function (models) {
        UserAgent = models.userAgent;
        Device.belongsTo(models.userAgent);
      }
    }
  });

  return Device;
};