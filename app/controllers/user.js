module.exports = function (include) {

  var User = require("../models").User;
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
          User.register({
            name: req.body.name,
            emailAddress: req.body.emailAddress
          }, req.body.password, function (err, user) {
            if (err) {
              console.log('error while user register!', err);
              return next(err);
            }

            res.send({
              "name": user.name,
              "emailAddress": user.emailAddress,
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