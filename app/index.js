var express = require('express');
var app = express();
app.use(express.static(__dirname + '/../build/development'));

/* istanbul ignore if */
if (require.main === module) {
  app.listen(process.env.PORT || 8081);
} else {
  module.exports = app;
}