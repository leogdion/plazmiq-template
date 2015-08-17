var express = require('express');
var app = express();
var roust = require('roust');

roust(app, '/api/v1', [__dirname + '/controllers']);

app.get('/', function (req, res) {
  res.send('Hello World!');
});

var server = app.listen(process.env.PORT || 5000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});