var matcherFactory = require('./arrow-function-expression');

describe('ArrowFunctionExpression matcher', function() {

  var matcher;

  beforeEach(function() {
    matcher = matcherFactory();
  });

  it("should return null for any argument", function() {
    expect(matcher()).toBeNull();
    expect(matcher(null)).toBeNull();
    expect(matcher({})).toBeNull();
  });
});