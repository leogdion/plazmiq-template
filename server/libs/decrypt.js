var fs = require('fs'),
    path = require('path'),
    simplecrypt = require("simplecrypt");

function read(filename, envVarName) {
  var fulpath = path.join(__dirname, "..", "..", filename);
  console.log('reading file: ' + filename);
  console.log(process.env);
  return fs.existsSync(fulpath) ? fs.readFileSync(fulpath).toString() : process.env[envVarName];
}

var encryption_key = read('.encryption_key', 'ENCRYPTION_KEY');
var salt = read('.salt', 'SALT');

var decrypt = simplecrypt({
  password: encryption_key,
  salt: salt
}).decrypt;

module.exports = function (file) {
  return JSON.parse(decrypt(fs.readFileSync(file).toString()));
};