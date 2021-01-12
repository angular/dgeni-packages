var matcherFactory = require('./import-declaration');

describe('ImportDeclaration matcher', () => {

  var matcher;

  beforeEach(() => {
    matcher = matcherFactory();
  });

  it("should return null for unsupported nodes", () => {
    expect(matcher({})).toBeNull();
    expect(matcher({ source: {} })).toBeNull();
  });

  it("should return a name for supported nodes", () => {
    expect(matcher({ source: { value: './file' } })).toBe('./file');
  });
});
