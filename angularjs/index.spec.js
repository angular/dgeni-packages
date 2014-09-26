var mockPackage = require('./mocks/mockPackage');
var Dgeni = require('dgeni');

describe('jsdoc package', function() {
  it("should be instance of Package", function() {
      expect(require('./') instanceof Dgeni.Package).toBeTruthy();
  });
});