var wrench = require('wrench'),
    merge = require('deepmerge'),
    decrypt = require('./decrypt'),
    path = require('path'),
    configuration;

var dirs = [{
  path: ["stages", "default"]
},
{
  path: ["stages", process.env.NODE_ENV]
},
{
  path: ["encrypted", process.env.NODE_ENV],
  encrypted: true
}];

function readdir(paths) {
  //var paths = Array.prototype.slice.call(arguments);
  paths.unshift(__dirname);
  //console.log(paths);
  var fullpath = path.join.apply(undefined, paths);
  return wrench.readdirSyncRecursive(fullpath).map(function (value) {
    return path.join(fullpath, value);
  });
}

module.exports = function () {
  if (!configuration) {
    console.log('test');
    configuration = dirs.reduce(function (configuration, dirPath) {
      var files = readdir(dirPath.path);
      var settings = [];
      if (dirPath.encrypted) {
        settings = files.map(decrypt);
      } else {
        settings = files.map(require);
      }
      settings.forEach(function (value) {
        //console.log(configuration);
        configuration = merge(configuration, value);
      });
      return configuration;
    }, {});
    //console.log(readdir("stages","default"));
    //console.log(readdir("stages",process.env.NODE_ENV));
    //console.log(readdir("encrypted",process.env.NODE_ENV));
    //console.log(wrench.readdirSyncRecursive(__dirname + "/stages/" + process.env.NODE_ENV));
    //console.log(wrench.readdirSyncRecursive(__dirname + "/encrypted/" + process.env.NODE_ENV));
    //configuration = {};
  }
  return configuration;
}();