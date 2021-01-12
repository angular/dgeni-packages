const matcherFactory = require('./literal');

describe('Literal matcher', () => {

  let matcher;

  beforeEach(() => {
    matcher = matcherFactory();
  });

  it("should return null for unsupported node", () => {
    expect(matcher({})).toBeNull();
    expect(matcher({value: null})).toBeNull();
    expect(matcher({value: ""})).toBeNull();
  });

  it("should return name for supported node", () => {
    expect(matcher({value: "test"})).toEqual("test");
  });
});