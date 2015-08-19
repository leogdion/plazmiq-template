module.exports = (function  () {
 function revquire (mapping, file) {
    var child, result = {};
    for (var key in mapping) {
      var value = process.env[mapping[key]];
      if (typeof value == "string") {
        result[key] = value;
      }
      else if (child = revquire(value)) {
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
  };

  return revquire;
})();