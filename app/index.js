var express = require('express');
var bodyParser = require('body-parser');
var roust = require('../roust');
var app = express();
var configuration = require('./configuration');

var initialize = require('./libs/initialize');

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

//app.use(express.static(__dirname + '/../public'));

var server = initialize(app);

/* istanbul ignore if */
if (require.main === module) {
  server.listen(process.env.PORT || 3001);
} else {
  module.exports = server;
}