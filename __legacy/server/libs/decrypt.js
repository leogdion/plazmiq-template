var fs = require('fs'),
    path = require('path'),
    simplecrypt = require("simplecrypt");

function read(filename, envVarName) {
  var fulpath = path.join(__dirname, "..", "..", filename);
  return fs.existsSync(fulpath) ? fs.readFileSync(fulpath).toString() : process.env[envVarName];
}

var encryption_key = read('.encryption_key', 'ENCRYPTION_KEY');
var salt = read('.salt', 'SALT');

var decrypt = simplecrypt({
  password: encryption_key,
  salt: salt
}).decrypt;

module.exports = function (file) {
  try {
    return JSON.parse(decrypt(fs.readFileSync(file).toString()));
  } catch (ex) {
    if (ex instanceof SyntaxError) {
      var error = new Error("The file '" + file + "' is unreadable.");
      error.fileName = file;
      error.innerException = ex;
      throw ex;
    } else {
      throw ex;
    }
  }

};