var express = require('express');
var bodyParser = require('body-parser');
var roust = require('../roust');
var app = express();
var configuration = require('./configuration');
var db = require('./libs/sequelize');
var lodash = require('lodash');

console.log(configuration);
app.use(function (req, res, next) {
  console.log("received request...");
  setTimeout(function () {
    console.log("replying");
    next();
  }, 1000);
});
// parse application/json
app.use(bodyParser.json());

app.roust('/api/v1', [__dirname + '/controllers']);
app.use(express.static(__dirname + '/../public'));

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
        db.app.createByName('default', 'yaCCeDCruL/8ccbFz57sQZiDiu7FVzQfjkMirvSTMBWg19z5Hu8OqYww/2Q/Y3r/').success(

        function () {
          listen.apply(app, args);
        });
      }
    });
  }
});

/* istanbul ignore if */
if (require.main === module) {
  console.log('as module')
  console.log(process.env);
  server.listen(process.env.PORT || 3001);
} else {
  module.exports = server;
}