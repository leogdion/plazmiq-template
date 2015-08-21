var wrench = require('wrench'),
    merge = require('deepmerge'),
    fs = require('fs'),
    path = require('path'),
    decrypt = require('./decrypt');
//logger = require('./logger.js');
/*
module.exports = function (dir, func) {
  function filesOnly(dir) {
    function _filesOnly(dir, subpath) {
      return subpath !== 'index.js' && subpath[0] !== '_' && fs.statSync(path.resolve(dir, subpath)).isFile();
    }

    return _filesOnly.bind(undefined, dir);
  }

  function basename(filename) {
    return filename.substring(0, filename.length - 3);
  }

  function addObj(obj, dir) {
    function _(obj, dir, file) {
      var mod, filepath = path.resolve(dir, file + '.js');
      try {
        mod = require(filepath);
      } catch (e) {
        logger.warn("unable to load '%s': %s", filepath, e);
        return;
      }
      obj[file] = mod;
    }

    return _.bind(undefined, obj, dir);
  }

  function obj(dir, files) {
    var o = {};
    files.forEach(addObj(o, dir));
    return o;
  }

  function parseFiles(files, dir, func) {
    if (func) {
      return func(files);
    } else {
      return obj(dir, files);
    }
  }

  return parseFiles(fs.readdirSync(dir).filter(filesOnly(dir)).map(basename), dir, func);
};
*/
module.exports = function () {
  function readdir(basedir, paths) {
    paths.unshift(basedir);
    var fullpath = path.join.apply(undefined, paths);
    if (fs.existsSync(fullpath)) {
      return wrench.readdirSyncRecursive(fullpath).map(function (value) {
        return path.join(fullpath, value);
      });
    } else {
      return [];
    }
  }

  var METHODS = {
    MERGE: 1
  };

  var indexer = function (settings) {

    return settings.directories.reduce(function (configuration, dirPath) {
      var files = readdir(settings.basedir, dirPath.path, settings.filter);
      if (settings.filter) {
        files = files.filter(settings.filter.test.bind(settings.filter));
      }
      console.log(files);
      var jsons = [];
      if (dirPath.encrypted) {
        jsons = files.map(decrypt);
      } else {
        jsons = files.map(require);
      }
      if (settings.method === METHODS.MERGE) jsons.forEach(function (value) {
        configuration = merge(configuration, value);
      });


      return configuration;
    }, {});
  };

  indexer.methods = METHODS;

  return indexer;
}();