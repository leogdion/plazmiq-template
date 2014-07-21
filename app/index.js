var express = require('express');
var bodyParser = require('body-parser');
var roust = require('../roust');
var app = express();

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