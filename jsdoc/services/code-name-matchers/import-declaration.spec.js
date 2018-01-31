var matcherFactory = require('./import-declaration');

describe('ImportDeclaration matcher', function() {

  var matcher;

  beforeEach(function() {
    matcher = matcherFactory();
  });

  it("should return null for unsupported nodes", function() {
    expect(matcher({})).toBeNull();
    expect(matcher({ source: {} })).toBeNull();
  });

  it("should return a name for supported nodes", function() {
    expect(matcher({ source: { value: './file' } })).toBe('./file');
  });
});
