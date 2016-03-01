module.exports = (function () {
  function revquire(mapping, file) {
    var child, result = {};
    for (var key in mapping) {
      var value, env_key = mapping[key];
      if (typeof env_key == "string" && (value = process.env[mapping[key]])) {
        result[key] = value;
      } else if (value && (child = revquire(env_key))) {
        result[key] = child;
      } else if (file) {
        try {
          return require(file);
        } catch (ex) {
          return undefined;
        }
      } else {
        return undefined;
      }
    }
    return result;
  }

  return revquire;
})();