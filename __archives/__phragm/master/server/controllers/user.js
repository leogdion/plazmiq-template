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
<<<<<<< HEAD:app/controllers/user.js
        create: function (req, res, next) {
          User.register({
            name: req.body.name,
            emailAddress: req.body.emailAddress
          }, req.body.password, function (err, user) {
            if (err) {
              return next(err);
            }

            res.send({
              "name": user.name
            });
          });
=======
        create: function (req, res) {
          console.log(req.body);
          if (req.body.secret !== 'testTEST123!') {
            res.status(400).send();
          } else {
            res.status(201).send('create');
          }
>>>>>>> phragm-master:__phragm/master/server/controllers/user.js
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