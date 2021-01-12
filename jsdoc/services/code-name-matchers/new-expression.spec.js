const matcherFactory = require('./new-expression');

describe('NewExpression matcher', () => {

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
    expect(codeNameServiceMock.find.calls.count()).toEqual(1);
  });

  it("should return name for supported node", () => {
    spyOn(codeNameServiceMock, 'find').and.callThrough();

    expect(matcher({callee: 'test'})).toEqual('test');
    expect(codeNameServiceMock.find.calls.count()).toEqual(1);
  });
});