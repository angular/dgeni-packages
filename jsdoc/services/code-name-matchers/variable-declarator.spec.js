var matcherFactory = require('./variable-declarator');

describe('VariableDeclarator matcher', () => {

  var matcher;

  beforeEach(() => {
    matcher = matcherFactory();
  });

  it("should return null for unsupported node", () => {
    expect(matcher({id: null})).toBeNull();
    expect(matcher({id: {}})).toBeNull();
    expect(matcher({id: {name: null}})).toBeNull();
    expect(matcher({id: {name: ""}})).toBeNull();
  });

  it("should return name for supported node", () => {
    expect(matcher({id: {name: "test"}})).toEqual("test");
  });
});