var url = require('url');
var emailer = require('../libs/emailer');

var urls = {
  _: "web",
  web: {
    _: "dev",
    dev: "http://localhost:8081",
    qa: "http://mysterious-oasis-7692.herokuapp.com",
    prod: "http://mysterious-oasis-7692.herokuapp.com"
  }
};

function baseUrl(source, stage) {
  source = source || urls._;
  stage = stage || urls[source]._;

  return urls[source][stage];
}

module.exports = function (include) {

  var User = require("../models").User;
  var Session = require("../models").Session;
  return {
    users: {
      params: {

      },
      actions: {
        index: function (req, res) {
          res.send('list ' + include("datetime"));
        },
        show: function (req, res) {
          res.send('show');
        },
        create: function (req, res, next) {
          var components = url.parse(req.get('referer') || req.get('origin') || baseUrl(req.body.source, req.body.stage));
          User.register({
            name: req.body.name,
            email: req.body.email
          }, req.body.password, function (err, user) {
            if (err) {
              return next(err);
            }
            var fullUrl = url.format({
              host: components.host,
              protocol: components.protocol,
              slashes: components.slashes,
              search: "activationKey=" + user.activationKey
            });

            emailer.queue('confirmation', {
              email: user.email,
              name: user.name,
              activationKey: user.activationKey,
              url: fullUrl
            }, function (error, response) {
              if (error) {
                res.status(400).send(error);
              } else {

                res.send({
                  "name": user.name
                });
              }
            });
          });
        },
        update: function (req, res) {
          User.activate(req.params.id, req.body.password, req.body.activationKey, function (err, user) {
            if (err) {
              return next(err);
            }

            var session = Session.build();
            session.setUser(user).then(

            function (session) {
              emailer.queue('welcome', {
                email: user.email,
                name: user.name
              }, function (error, response) {
                if (error) {
                  res.status(400).send(error);
                } else {
                  res.send({
                    "sessionId": session.id
                  });
                }
              });
            }).
            catch (function (error) {
              res.status(400).send(error);
            });

          });
        },
        destroy: function (req, res) {
          res.send('destroy');
        }
      }
    }
  };
};