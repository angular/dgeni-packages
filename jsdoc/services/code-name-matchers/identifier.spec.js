var matcherFactory = require('./identifier');

describe('Identifier matcher', () => {

  var matcher;

  beforeEach(() => {
    matcher = matcherFactory();
  });

  it("should return null for unsupported node", () => {
    expect(matcher({})).toBeNull();
    expect(matcher({foo: "bar"})).toBeNull();
  });

  it("should return name for supported node", () => {
    expect(matcher({name: "test"})).toEqual("test");
  });
});