var passport = require('passport');
var passportLocalSequelize = require('passport-local-sequelize');
var Sequelize = require('sequelize');

// The model definition is done in /path/to/models/project.js
// As you might notice, the DataTypes are the very same as explained above
module.exports = function (sequelize, DataTypes) {
  var User = sequelize.define('User', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: Sequelize.STRING,
      unique: true,
      allowNull: false,
      validate: {
        len: [3, 15],
        is: /^[a-z0-9]+(?:-[a-z0-9]+)*$/
      }
    },
    email: {
      type: Sequelize.STRING,
      unique: true,
      allowNull: false,
      validate: {
        isEmail: true
      }
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

  return User;
};