var matcherFactory = require('./return-statement');

describe('ReturnStatement matcher', function() {

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
    expect(matcher({argument: null})).toBeNull();    
    expect(codeNameServiceMock.find.calls.count()).toEqual(2);
  });

  it("should return name for supported node", function() {
    spyOn(codeNameServiceMock, 'find').and.callThrough();

    expect(matcher({argument: 'test'})).toEqual('test');
    expect(codeNameServiceMock.find.calls.count()).toEqual(1);
  });  
});