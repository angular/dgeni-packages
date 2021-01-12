const matcherFactory = require('./expression-statement');

describe('ExpressionStatement matcher', () => {

  let matcher, codeNameServiceMock;

  beforeEach(() => {
    codeNameServiceMock = {
      find(arg) {
        return arg;
      }
    };
    matcher = matcherFactory(codeNameServiceMock);
  });

  it("should return null for unsupported node", () => {
    spyOn(codeNameServiceMock, 'find').and.callThrough();

    expect(matcher({})).toBeNull();
    expect(matcher({expression: null})).toBeNull();
    expect(codeNameServiceMock.find.calls.count()).toEqual(2);
  });

  it("should return name for supported node", () => {
    spyOn(codeNameServiceMock, 'find').and.callThrough();

    expect(matcher({expression: 'test'})).toEqual('test');
    expect(codeNameServiceMock.find.calls.count()).toEqual(1);
  });
});