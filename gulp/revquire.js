module.exports = function (mapping, file) {
  var result = {};
  for (var key in mapping) {
    var value = process.env[mapping[key]];
    if (value) {
      result[key] = value;
    } else {
      try {
        console.log(file);
        return require(file);
      } catch (ex) {
        return undefined;
      }
    }
  }
  return result;
};