var Dgeni = require('dgeni');

describe('angularjs package', function() {
  it("should be instance of Package", function() {
      expect(require('./') instanceof Dgeni.Package).toBeTruthy();
  });
});