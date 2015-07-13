var express = require("express");
var app = express(),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    session = require('express-session');

var Sequelize = require('sequelize');
var sequelize = new Sequelize('auth-sample', 'auth-sample', null, {dialect: 'postgres'});
var passport = require('passport');
var passportLocalSequelize = require('passport-local-sequelize');

var User = passportLocalSequelize.defineUser(sequelize);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(require('connect-multiparty')());
app.use(cookieParser());
app.use(session({ secret: 'super-secret' }));

app.use(passport.initialize());
app.use(passport.session());

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.get('/', 
  passport.authenticate('local', {failureFlash : true}),
  function (req, res) {
  res.send('Hello World!');
});

app.post('/users',function(req, res, next) {
  console.log('registering user');
  console.log(req.body);
  User.register({ username: req.body.username }, req.body.password, function(err) {
    if (err) { console.log('error while user register!', err); return next(err); }

    console.log('user registered!');

    res.redirect('/');
  });
});

sequelize.sync().then(
	function () {
		var server = app.listen(3000, function () {
		  var host = server.address().address;
		  var port = server.address().port;

		  console.log('Example app listening at http://%s:%s', host, port);
		});
});