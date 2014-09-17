var indexer = require('../libs/indexer'),
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

module.exports = function () {
  if (!process.env.NODE_ENV) {
    throw new Error('Must supply node environment.');
  }
  if (!configuration) {
    configuration = indexer({
      basedir: __dirname,
      directories: dirs,
      filter: /.*\.json$/i,
      method: indexer.methods.MERGE
    });
  }
  return configuration;
}();