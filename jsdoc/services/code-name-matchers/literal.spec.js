var matcherFactory = require('./literal');

describe('Literal matcher', function() {

  var matcher;

  beforeEach(function() {
    matcher = matcherFactory();
  });

  it("should return null for unsupported node", function() {
    expect(matcher({})).toBeNull();
    expect(matcher({value: null})).toBeNull();
    expect(matcher({value: ""})).toBeNull();
  });

  it("should return name for supported node", function() {
    expect(matcher({value: "test"})).toEqual("test");
  });
});