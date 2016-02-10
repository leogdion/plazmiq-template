<<<<<<< HEAD:app/index.js
var app = require('./app.js');
var db = require("./models");

db.sequelize.sync({
  force: true
}).then(

function () {
  var server = app.listen(process.env.PORT || 5000, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Example app listening at http://%s:%s', host, port);
  });
});
=======
var express = require('express');
var bodyParser = require('body-parser');
var roust = require('../roust');
var app = express();

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


/* istanbul ignore if */
if (require.main === module) {
  app.listen(process.env.PORT || 3001);
} else {
  module.exports = app;
}
>>>>>>> phragm-master:__phragm/master/server/index.js
