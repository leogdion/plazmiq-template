module.exports = function (include) {
  var Sequelize = require('sequelize');

  if (process.env.DATABASE_URL) {
    var sequelize = new Sequelize(process.env.DATABASE_URL);
  } else {
    var sequelize = new Sequelize('beginkit-master', 'beginkit-user', '', {
      dialect: 'postgres'
    });
  }

  var User = sequelize.import(__dirname + "/../models/user.js");
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
          }, req.body.password, function (err) {
            if (err) {
              console.log('error while user register!', err);
              return next(err);
            }

            console.log('user registered!');

            res.redirect('/');
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