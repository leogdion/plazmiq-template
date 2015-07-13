var express = require("express");
var app = express();

var Sequelize = require('sequelize');
var sequelize = new Sequelize('auth-sample', 'auth-sample', null, {dialect: 'postgres'});

var User = sequelize.define('User', {
  username: Sequelize.STRING,
  birthday: Sequelize.DATE
});

app.get('/', function (req, res) {
  res.send('Hello World!');
});

sequelize.sync().then(
	function () {
		var server = app.listen(3000, function () {
		  var host = server.address().address;
		  var port = server.address().port;

		  console.log('Example app listening at http://%s:%s', host, port);
		});
});