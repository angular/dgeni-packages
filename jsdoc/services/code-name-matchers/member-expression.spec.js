var matcherFactory = require('./member-expression');

describe('MemberExpression matcher', function() {

  var matcher, codeNameServiceMock;

  beforeEach(function() {
    codeNameServiceMock = {
      find: function (arg) {
        return arg;
      }
    };
    matcher = matcherFactory(codeNameServiceMock);
  });

  it("should return null for unsupported node", function() {
    spyOn(codeNameServiceMock, 'find').and.callThrough();

    expect(matcher({})).toBeNull();
    expect(codeNameServiceMock.find.calls.count()).toEqual(1);
  });

  it("should return name for supported node", function() {
    spyOn(codeNameServiceMock, 'find').and.callThrough();

    expect(matcher({property: 'test'})).toEqual('test');
    expect(codeNameServiceMock.find.calls.count()).toEqual(1);
  });  
});