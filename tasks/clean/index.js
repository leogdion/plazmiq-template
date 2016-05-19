var async = require('async');
var rimraf = require('rimraf');

module.exports = function (gulp) {
  return function (done) {
    async.each(['.tmp', 'build'], rimraf, done);
  };
};