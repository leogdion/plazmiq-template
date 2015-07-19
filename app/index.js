var express = require("express");
var app = express(),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    session = require('express-session'),
    BearerStrategy = require('passport-http-bearer').Strategy;

var Sequelize = require('sequelize');
var sequelize = new Sequelize('auth-sample', 'auth-sample', null, {dialect: 'postgres'});
var passport = require('passport');
var passportLocalSequelize = require('passport-local-sequelize');

var User = sequelize.define('User', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
    type : Sequelize.STRING,
    unique: true,
    allowNull: false,
    is: /^  [a-z0-9]+    (?:             -             [a-z0-9]+   )*           $/
  },
  emailAddress : {
    type : Sequelize.STRING,
    unique: true,
    allowNull: false,
    isEmail: true
  },
    hash: {
        type: Sequelize.STRING(5000),
        allowNull: false
    },
    salt: {
        type: Sequelize.STRING,
        allowNull: false
    },
    activationKey: {
        type: Sequelize.STRING,
        allowNull: true
    },
    resetPasswordKey: {
        type: Sequelize.STRING,
        allowNull: true
    }
});

passportLocalSequelize.attachToUser(User, {
  usernameField: 'name',
  activationRequired: true
});

var Session = sequelize.define('Session', {
  id: {
    type : Sequelize.UUID,
    unique: true,
    allowNull: false,
    defaultValue: Sequelize.UUIDV4
  }
})

Session.belongsTo(User);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(require('connect-multiparty')());
app.use(cookieParser());
app.use(session({ secret: 'super-secret' }));

app.use(passport.initialize());
app.use(passport.session());

passport.use(User.createStrategy());
passport.use(new BearerStrategy({
  },
  function(token, done) {
    // asynchronous validation, for effect...
    process.nextTick(function () {
      
      Session.find({where : {id : token}, include: [{
        model: User}]}).then(function (session) {
          done(null, session.User);
      });
    });
  }
));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get('/', 
  passport.authenticate('bearer', {failureFlash : true}),
  function (req, res) {
  res.send(req.user);
});

app.post('/users',function(req, res, next) {
  console.log('registering user');
  console.log(req.body);
  User.register({  name: req.body.name, emailAddress : req.body.emailAddress }, req.body.password, function(err) {
    if (err) { console.log('error while user register!', err); return next(err); }

    console.log('user registered!');

    res.redirect('/');
  });
});

app.post('/sessions', function (req, res, next) {
  User.authenticate()(req.body.name, req.body.password, function (_, user, error) {
    console.log(arguments);
    Session.create({'UserId' : user.id}).then(
      function (session) {
        res.send(session);
      }
    );
  });
});

sequelize.sync({force : true}).then(
	function () {
		var server = app.listen(3000, function () {
		  var host = server.address().address;
		  var port = server.address().port;

		  console.log('Example app listening at http://%s:%s', host, port);
		});
});