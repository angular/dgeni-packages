var matcherFactory = require('./class-declaration');

describe('ClassDeclaration matcher', function() {

  var matcher;

  beforeEach(function() {
    matcher = matcherFactory();
  });

  it("should return null for unsupported node", function() {
    expect(matcher({id: null})).toBeNull();
    expect(matcher({id: {}})).toBeNull();
    expect(matcher({id: {name: null}})).toBeNull();
    expect(matcher({id: {name: ""}})).toBeNull();
  });

  it("should return name for supported node", function() {
    expect(matcher({id: {name: "test"}})).toEqual("test");
  });  
});