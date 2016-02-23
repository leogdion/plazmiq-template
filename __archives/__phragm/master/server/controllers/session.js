module.exports = function (include) {

  var db = require("../models");

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
        create: function (req, res, next) {
          db.User.authenticate()(req.body.name, req.body.password, function (_, user, error) {
            db.Session.create({
              'UserId': user.id
            }).then(

            function (session) {
              res.send(session);
            });
          });
        },
        update: function (req, res) {
          res.send('update');
        },
        destroy: function (req, res) {
          res.send('destroy');
        }
      }
    }
  };
};