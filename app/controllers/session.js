var async = require('async'),
    crypto = require('crypto'),
    db = require("../libs/sequelize"),
    QueryChainer = db.Sequelize.Utils.QueryChainer;

var User = db.user,
    App = db.app,
    Device = db.device,
    Session = db.session,
    UserAgent = db.userAgent,
    Sequelize = db.Sequelize;

var passport = require('passport');
module.exports = function (include) {
  return {
    sessions: {
      params: {

      },
      actions: {
        index: function (req, res) {
          res.send('list ' + include("datetime"));
        },
        show: function (req, res) {
          res.send('show');
        },
        /**
         * @api {post} /session Login to the application.
         * @apiName Login
         * @apiGroup Session
         *
         * @apiParam {String} name Username.
         * @apiParam {String} password Password.
         * @apiParam {String} apiKey App api key.
         * @apiParam {String} [deviceKey] Device key.
         *
         * @apiSuccess {String} key Session key.
         * @apiSuccess {String} [deviceKey] Device key.
         *
         * @apiSuccessExample Success-Response:
         *     HTTP/1.1 200 OK
         *     {
         *       "key": "dGVzdA==",
         *       "device": "dGVzdA=="
         *     }
         *
         * @apiSuccessExample Success-Response:
         *     HTTP/1.1 200 OK
         *     {
         *       "key": "dGVzdA=="
         *     }
         *
         * @apiError UnknownUsernameAndPassword The Username and Password combination has not been found.
         *
         * @apiErrorExample Error-Response:
         *     HTTP/1.1 404 Not Found
         *     {
         *       "error": "UnknownUsernameAndPassword"
         *     }
         *
         * @apiError UnknownApiKey The Application Api Key has not be found.
         *
         * @apiErrorExample Error-Response:
         *     HTTP/1.1 404 Not Found
         *     {
         *       "error": "UnknownApiKey"
         *     }
         */
        create: function(req, res, next) {
            passport.authenticate('local', function(err, user, info) {
              console.log(err);
              console.log(user);
              console.log(info);
              if (user === false) {
                res.status(info.status).send(info.message);
              } else {
                console.log(req);
                res.send(user);
              }
            })(req, res, next);
        },
        update: function (req, res) {
          // find the 

          function beginSession(device, app, user, request, response) {
            Session.create({
              key: crypto.randomBytes(48),
              clientIpAddress: request.headers['x-forwarded-for'] || request.connection.remoteAddress
            }).success(function (session) {
              var chainer = new QueryChainer();
              chainer.add(session.setDevice(device));
              chainer.add(session.setApp(app));
              chainer.add(session.setUser(user));
              chainer.run().success(function (results) {
                response.status(201).send({
                  sessionKey: session.key.toString('base64'),
                  deviceKey: device.key.toString('base64'),
                  user: {
                    name: user.name,
                    email: user.email
                  }
                });
              });
            });
          }

          Session.find({
            include: [User, App,
            {
              model: Device,
              include: [UserAgent]
            }],
            where: Sequelize.and({
              'device.key': new Buffer(req.body.deviceKey, 'base64')
            }, {
              'app.key': req.body.apiKey
            }, {
              'key': new Buffer(req.params.id, 'base64')
            }, {
              'device.userAgent.text': req.headers['user-agent']
            }, {
              'lastActivatedAt': {
                gt: new Date((new Date()).valueOf() - Session.constants().expiration)
              }
            }, Sequelize.or({
              'endedAt': {
                gt: new Date()
              }
            }, {
              'endedAt': null
            }))
          }).success(function (session) {
            if (!session) {
              console.log('nope');
              res.status(404).send();
            } else if ((new Date() - session.lastActivatedAt) < Session.constants().renewal) {
              console.log('renewing');
              session.renew().success(function () {
                res.status(201).send({
                  sessionKey: session.key.toString('base64'),
                  deviceKey: session.device.key.toString('base64'),
                  user: {
                    name: session.user.name,
                    email: session.user.email
                  }
                });
              }).error(function (error) {
                res.status(500).send(error);
              });
            } else {
              beginSession(session.device, session.app, session.user, req, res);
            }
          }).error(function (error) {
            console.log(error);
            res.status(500).send(error);
          });
        },
        destroy: function (req, res) {
          res.send('destroy');
        }
      }
    }
  };
};