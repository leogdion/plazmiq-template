var async = require('async'),
    crypto = require('crypto'),
    db = require("../libs/sequelize");

var User = db.user,
    App = db.app,
    Device = db.device,
    Session = db.session,
    UserAgent = db.userAgent,
    Sequelize = db.Sequelize;

var constants = {
  renewal: 5 * 60 * 1000,
  expiration: 7 * 24 * 60 * 60 * 1000
};

module.exports = function (sequelize, DataTypes) {
  var Session = sequelize.define("session", {

    key: {
      type: DataTypes.BLOB('tiny'),
      allowNull: false
    },
    clientIpAddress: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        //isIP: true
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
        Session.belongsTo(models.user);
        Session.belongsTo(models.app);
        Session.belongsTo(models.device);
      },
      constants: function () {
        return constants;
      },
      login : function () {
        return function (req, user, password, done) {
          function findUser(requestBody) {
            function _(requestBody, cb) {
              User.findByLogin(requestBody.name, requestBody.password, cb.bind(undefined, undefined));
            }

            return _.bind(undefined, requestBody);
          }

          function findApp(requestBody) {
            function _(requestBody, cb) {
              App.findByKey(requestBody.apiKey).success(cb.bind(undefined, undefined));
            }

            return _.bind(undefined, requestBody);
          }

          function findDevice(request) {
            function _(request, cb) {
              Device.findByKey(request.body.deviceKey, request.headers['user-agent'], cb.bind(undefined, undefined));
            }

            return _.bind(undefined, request);
          }

          function beginSession(device, app, user, request, response) {
            console.log("TEST2");
            Session.create({
              key: crypto.randomBytes(48),
              clientIpAddress: request.headers['x-forwarded-for'] || request.connection.remoteAddress
            }).success(function (session) {
                 console.log("TEST4");
                 console.log(session);
              //var chainer = new QueryChainer();
              async.map([
                [session.setDevice, device],
                [session.setApp, app],
                [session.setUser, user],
              ], function (spec, cb) {
                spec[0].call(session, spec[1], cb);
              }, function (err, results) {
                 console.log("TEST3");
                 console.log(err);
                 console.log(results);
                if (err) {
                  done(null, false, err);
                } else {
                  done(null, {
                
                  //response.status(201).send({
                    sessionKey: session.key.toString('base64'),
                    deviceKey: device.key.toString('base64'),
                    user: {
                      name: user.name,
                      email: user.email
                    }
                  });
                }
              });
            });
          }

          async.parallel({
            user: findUser(req.body),
            app: findApp(req.body),
            device: findDevice(req)
          }, function (error, result) {
            console.log(error);
            console.log(result);
            if (!result.user) {
              done(null, false, {
                status: 401,
                error: "Unknown username or password."
              });
            } else if (!result.app) {
              done(null, false, {
                status: 400,
                error: "Unknown application key."
              });
            } else {
              beginSession(result.device, result.app, result.user, req, res);
            }
          });
        };
      },
      serializeUser: function () {
        return function(id, done) {
          console.log('test')
          //findById(id, function (err, user) {
            done(null, {id : "test"});
          //});
        };
      },
      deserializeUser: function () {
        return function(user, done) {
          console.log('test')
          done(null, user.id);
        };
      }
    }
  });

  //Session.belongsTo(User).belongsTo(App).belongsTo(Device);
  return Session;
};
