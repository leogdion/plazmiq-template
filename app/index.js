var app = require('./app.js');
var db = require("./models");

db.sequelize.sync({
  force: true
}).then(

function () {
  var server = app.listen(process.env.PORT || 5000, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Example app listening at http://%s%s', host, port);
  });
});