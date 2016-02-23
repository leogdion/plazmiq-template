var chai = require('chai');
var fs = require('fs');
var app = require(__dirname + '/../../server');
chai.should();

describe('it works', function () {
  it('should do something', function () {
    return app.listen.should.be.a('function');
  });
});