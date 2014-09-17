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
          console.log(req.body);
          //console.log(db.registration);
          var data = {
            email: req.body.email,
            secret: new Buffer(uuid.parse(uuid.v4())),
            key: new Buffer(uuid.parse(uuid.v4()))
          };
          console.log(data.secret.toString('base64'));
          db.registration.create(data).success(function (registration) {
            //res.status(200).send({
            //  key: data.key.toString('base64')
            //});
            emailer.queue('confirmation', {
              email: data.email,
              secret: data.secret.toString('base64')
            }, function (error, response) {
              // callback(error ? 400 : undefined, error ? error : {
              //   key: data.key.toString('base64')
              // });
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