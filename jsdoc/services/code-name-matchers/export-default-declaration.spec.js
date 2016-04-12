var matcherFactory = require('./export-default-declaration');

describe('ExportDefaultDeclaration matcher', function() {

  var matcher;

  beforeEach(function() {
    matcher = matcherFactory();
  });

  it("should return null for any argument", function() {
    expect(matcher({})).toBeNull();
  });
});