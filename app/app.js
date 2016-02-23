var express = require('express');
var roust = require('roust'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    session = require('express-session'),
    BearerStrategy = require('passport-http-bearer').Strategy;
var multiparty = require('connect-multiparty');
var flash = require('connect-flash');

var passport = require('passport');
var passportLocalSequelize = require('passport-local-sequelize');

var db = require("./models");



module.exports = (function () {

  var app = express();
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    next();
  });
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({
    extended: false
  }));
  app.use(multiparty());
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
  return app;
})();