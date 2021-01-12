const matcherFactory = require('./object-expression');

describe('ObjectExpression matcher', () => {

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