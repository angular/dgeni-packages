var matcherFactory = require('./program');

describe('Program matcher', function() {

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
    expect(matcher({body: null})).toBeNull();
    expect(matcher({body: []})).toBeNull();
    expect(matcher({body: [null, "test"]})).toBeNull();
    expect(codeNameServiceMock.find.calls.count()).toEqual(0);
  });

  it("should return name for supported node", function() {
    spyOn(codeNameServiceMock, 'find').and.callThrough();

    expect(matcher({body: ["test"]})).toEqual("test");
    expect(codeNameServiceMock.find.calls.count()).toEqual(1);
  });  
});