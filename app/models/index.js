var Sequelize = require("sequelize");
var fs = require("fs");
var path = require("path");

if (process.env.DATABASE_URL) {
  var sequelize = new Sequelize(process.env.DATABASE_URL);
} else {
  var sequelize = new Sequelize('beginkit-master', 'beginkit-user', '', {
    dialect: 'postgres'
  });
}
var db = {};

fs.readdirSync(__dirname).filter(function (file) {
  return (file.indexOf(".") !== 0) && (file !== "index.js");
}).forEach(function (file) {
  var model = sequelize.import(path.join(__dirname, file));
  db[model.name] = model;
});

Object.keys(db).forEach(function (modelName) {
  if ("associate" in db[modelName]) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;