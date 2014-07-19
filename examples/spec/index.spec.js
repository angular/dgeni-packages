var examplesPackage = require('../index');
var Package = require('dgeni').Package;

describe('examples package', function() {
  it("should be instance of Package", function() {
      expect(examplesPackage instanceof Package).toBeTruthy();
  });
});
