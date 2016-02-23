var passport = require('passport');

module.exports = function (include) {
  return {
    services : {
      pocket : {
        params: {

        },
        actions: {
          index: function (req, res) {
            res.send('list ' + include("datetime"));
          },
          show: function (req, res) {
            res.send('show');
          },
          create: function(req, res, next) {
            passport.authenticate('local', function(err, user, info) {
              console.log(err);
              console.log(user);
              console.log(info);
              if (user === false) {
                res.status(info.status).send(info.message);
              } else {
                console.log(req);
                res.send("create");
              }
            })(req, res, next);
          },
          update: function (req, res) {
            res.send('update');
          },
          destroy: function (req, res) {
            res.send('destroy');
          }
        }
      }
    }
  };
};