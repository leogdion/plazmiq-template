var db = require("../libs/sequelize"),
    uuid = require('node-uuid'),
    emailer = require("../libs/emailer");


module.exports = function (include) {
  return {
    registrations: {
      params: {

      },
      actions: {
        index: function (req, res) {
          res.send('list ' + include("datetime"));
        },
        show: function (req, res) {
          res.send('show');
        },
        create: function (req, res) {
          var data = {
            email: req.body.email,
            secret: new Buffer(uuid.parse(uuid.v4())),
            key: new Buffer(uuid.parse(uuid.v4()))
          };
          db.user.count({
            where: {
              email: data.email
            }
          }).success(

          function (c) {
            if (c) {
              res.status(409).send({
                error: {
                  message: "Email address is already being used.",
                  type: "AlreadyInUse",
                  field: "email"
                }
              });
            } else {
              db.registration.create(data).success(function (registration) {
                var url = (req.body.redirect.uri) ? (req.body.redirect.uri + "?secret=" + encodeURIComponent(data.secret.toString('base64')) + "&email=" + data.email) : data.secret.toString('base64');
                console.log(url);
                emailer.queue('confirmation', {
                  email: data.email,
                  secret: url
                }, function (error, response) {
                  if (error) {
                    res.status(400).send(error);
                  } else {
                    res.send({
                      key: data.key.toString('base64')
                    });
                  }
                });

              }).error(function (error) {
                console.log(error);
                if (error.email) {
                  res.status(400).send({
                    error: error
                  });
                } else if (error) {
                  res.status(500).send(error);
                }
              });
            }
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