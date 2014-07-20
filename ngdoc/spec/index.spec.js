var ngdocPackage = require('../index');
var Package = require('dgeni').Package;

describe('ngdoc package', function() {
  it("should be instance of Package", function() {
      expect(ngdocPackage instanceof Package).toBeTruthy();
  });
});