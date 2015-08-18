var express = require('express');
var app = express();
var roust = require('roust'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    session = require('express-session'),
    BearerStrategy = require('passport-http-bearer').Strategy;

var flash = require('connect-flash');
var db = require("./models");


var passport = require('passport');
var passportLocalSequelize = require('passport-local-sequelize');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(require('connect-multiparty')());
app.use(cookieParser());
app.use(session({
  secret: 'super-secret',
  resave: false,
  saveUninitialized: false
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

passport.use(db.User.createStrategy());
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

passport.serializeUser(db.User.serializeUser());
passport.deserializeUser(db.User.deserializeUser());


app.get('/', passport.authenticate('bearer', {
  failureFlash: true
}), function (req, res) {
  res.send(req.user);
});


roust(app, '/api/v1', [__dirname + '/controllers']);


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