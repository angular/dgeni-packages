var jsdocPackage = require('../index');
var Package = require('dgeni').Package;

describe('jsdoc package', function() {
  it("should be instance of Package", function() {
      expect(jsdocPackage instanceof Package).toBeTruthy();
  });
});