var basePackage = require('../index');
var Package = require('dgeni').Package;

describe('base package', function() {
  it("should be instance of Package", function() {
      expect(basePackage instanceof Package).toBeTruthy();
  });
});