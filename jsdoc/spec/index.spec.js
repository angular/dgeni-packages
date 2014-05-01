var package = require('../index');
var Config = require('dgeni').Config;

describe('jsdoc package', function() {
  it("should load the package", function() {
    package(new Config());
  });
});