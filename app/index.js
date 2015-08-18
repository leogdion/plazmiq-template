var express = require('express');
var app = express();
var roust = require('roust');
var Sequelize = require('sequelize');

roust(app, '/api/v1', [__dirname + '/controllers']);

if (process.env.DATABASE_URL) {
  var sequelize = new Sequelize(process.env.DATABASE_URL);
} else {
  var sequelize = new Sequelize('beginkit-master', 'beginkit-user', '', {
    dialect: 'postgres'
  });
}

var User = sequelize.import(__dirname + "/models/user.js");
var Session = sequelize.import(__dirname + "/models/session.js");

app.get('/', function (req, res) {
  res.send('Hello World!');
});

sequelize.sync({
  force: true
}).then(

function () {
  var server = app.listen(process.env.PORT || 5000, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Example app listening at http://%s:%s', host, port);
  });
});