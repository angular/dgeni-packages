const matcherFactory = require('./array-expression');

describe('ArrayExpression matcher', () => {

  let matcher;

  beforeEach(() => {
    matcher = matcherFactory();
  });

  it("should return null for any argument", () => {
    expect(matcher()).toBeNull();
    expect(matcher(null)).toBeNull();
    expect(matcher({})).toBeNull();
  });
});