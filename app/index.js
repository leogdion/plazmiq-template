var express = require('express');
var app = express();
var roust = require('roust');
var Sequelize = require('sequelize'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    session = require('express-session'),
    BearerStrategy = require('passport-http-bearer').Strategy;

var flash = require('connect-flash');


if (process.env.DATABASE_URL) {
  var sequelize = new Sequelize(process.env.DATABASE_URL);
} else {
  var sequelize = new Sequelize('beginkit-master', 'beginkit-user', '', {
    dialect: 'postgres'
  });
}


var passport = require('passport');
var passportLocalSequelize = require('passport-local-sequelize');

var User = sequelize.import(__dirname + "/models/user.js");
var Session = sequelize.import(__dirname + "/models/session.js");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(require('connect-multiparty')());
app.use(cookieParser());
app.use(session({
  secret: 'super-secret'
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

passport.use(User.createStrategy());
passport.use(new BearerStrategy({}, function (token, done) {
  // asynchronous validation, for effect...
  process.nextTick(function () {

    Session.find({
      where: {
        id: token
      },
      include: [{
        model: User
      }]
    }).then(function (session) {
      done(null, session.User);
    });
  });
}));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.get('/', passport.authenticate('bearer', {
  failureFlash: true
}), function (req, res) {
  res.send(req.user);
});


roust(app, '/api/v1', [__dirname + '/controllers']);


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