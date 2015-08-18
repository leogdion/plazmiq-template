var express = require('express');
var app = express();
var roust = require('roust');
var Sequelize = require('Sequelize');

roust(app, '/api/v1', [__dirname + '/controllers']);

/*
var sequelize = new Sequelize('beginkit-master', 'beginkit-user', '', {
  dialect: 'postgres'
});
*/

app.get('/', function (req, res) {
  res.send('Hello World!');
});

var server = app.listen(process.env.PORT || 5000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});