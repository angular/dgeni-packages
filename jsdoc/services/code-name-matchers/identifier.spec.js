var matcherFactory = require('./identifier');

describe('Identifier matcher', function() {

  var matcher;

  beforeEach(function() {
    matcher = matcherFactory();
  });

  it("should return null for unsupported node", function() {
    expect(matcher({})).toBeNull();
    expect(matcher({foo: "bar"})).toBeNull();
  });

  it("should return name for supported node", function() {
    expect(matcher({name: "test"})).toEqual("test");
  });
});