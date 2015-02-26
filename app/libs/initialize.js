var lodash = require('lodash');
var db = require('./sequelize');

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
          var pw = require('crypto').randomBytes(8).toString('base64');
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