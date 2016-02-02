var fs = require('fs'),
    path = require('path'),
    Sequelize = require('sequelize'),
    lodash = require('lodash'),
    sequelize, db = {},
    modeldir = path.join(__dirname, "..", "models"),
    configuration = require('../configuration'),
    Sequalize = require('sequelize'),
    logger; // = require('./logger');

function build_sequalize() {
  var options = configuration.database.options || {};
  //options.logging = logger[configuration.sequelize.logging.level];
  if (configuration.database.connection_string_env) {
    return new Sequalize(process.env[configuration.database.connection_string_env], options);
  } else {
    return new Sequalize(configuration.database.database, configuration.database.username, configuration.database.password, options);
  }
}

sequelize = build_sequalize();

fs.readdirSync(path.join(modeldir)).filter(function (file) {
  return (file.indexOf('.') !== 0) && (file !== 'index.js');
}).forEach(function (file) {
  console.log(file);
  var model = sequelize.import(path.join(modeldir, file));
  db[model.name] = model;
});

Object.keys(db).forEach(function (modelName) {
  if ('associate' in db[modelName]) {
    db[modelName].associate(db);
  }
});

module.exports = lodash.extend({
  sequelize: sequelize,
  Sequelize: Sequelize
}, db);