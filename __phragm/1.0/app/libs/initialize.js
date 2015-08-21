var lodash = require('lodash');
var db = require('./sequelize');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var async = require('async');
var crypto =require('crypto');
module.exports = function (app) {
  var listen = app.listen;

  var server = lodash.extend(app, {
    listen: function () {
      var args = Array.prototype.slice.call(arguments, 0);
      db.sequelize.sync({
        force: true
      }).complete(

      function (err) {
        if (err) {
          console.log(err);
          throw err[0];
        } else {
          var User = db.user,
    App = db.app,
    Device = db.device,
    Session = db.session,
    UserAgent = db.userAgent,
    Sequelize = db.Sequelize;
        passport.use(new LocalStrategy({
    usernameField: 'name', passReqToCallback: true}, function (req, user, password, done) {
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
            console.log(request.connection.remoteAddress);
            Session.create({
              key: crypto.randomBytes(48),
              clientIpAddress:  '129.89.23.1'//request.headers['x-forwarded-for'] || request.connection.remoteAddress
            }).then(function (session) {
              //console.log("TEST$!");
              console.log(session.dataValues);
              //console.log(arguments);
              //var chainer = new QueryChainer();
              async.map([
                [session.setDevice, device],
                [session.setApp, app],
                [session.setUser, user],
              ], function (spec, cb) {
                console.log('test');
                spec[0].call(session, spec[1]).then(function (result){
                  cb(null, spec[1]);
                });
              }, function (err, results) {
                //console.log(err);
                //console.log(results);
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
            }).catch(function (error) {
              console.log(error);
            });
          }

          async.parallel({
            user: findUser(req.body),
            app: findApp(req.body),
            device: findDevice(req)
          }, function (error, result) {
            if (!result.user) {
              done(null, false, {
                status: 401,
                message: "Unknown username or password."
              });
            } else if (!result.app) {
              console.log('error missing app');
              done(null, false, {
                status: 400,
                message: "Unknown application key."
              });
            } else {
              beginSession(result.device, result.app, result.user, req);
            }
          });
        }));
        passport.serializeUser(function (user, done) {
          console.log(user);
          done(null, user.sessionKey);
        });
        passport.deserializeUser(function (id, done) {
          console.log('session Id');
          console.log(id);
          Session.find({where : {sessionKey : id}}).then(function (session) {
            done(null, session);
          });
        }); 
          var pw = crypto.randomBytes(8).toString('base64');
          console.log(pw);
          /*
          db.user.newLogin({
            'name': 'leo-dion',
            'password': pw,
            'email': 'test+leo@brightdigit.com'
          }).success(

          function (user) {
          */
            db.app.createByName('default', 'yaCCeDCruL/8ccbFz57sQZiDiu7FVzQfjkMirvSTMBWg19z5Hu8OqYww/2Q/Y3r/').then(

            function (hostApp) {
              var regPermission = db.permission.build({name : 'registration'});
              db.user.newLogin({name: "leogdion-test", password: "testtest", email: "leo.dion+test@gmail.com"});
              regPermission.save().then ( function (regPermission) {
                regPermission.addApp(hostApp).then( function () {
                listen.apply(app, args);

                });
              });
            });
          }
          //);

        //}
      });
    }
  });

  return server;
};