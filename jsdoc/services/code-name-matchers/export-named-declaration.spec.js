var matcherFactory = require('./export-named-declaration');

describe('ExportNamedDeclaration matcher', function() {

  var matcher;

  beforeEach(function() {
    matcher = matcherFactory();
  });

  it("should return null for any argument", function() {
    expect(matcher({})).toBeNull();
  });
});
