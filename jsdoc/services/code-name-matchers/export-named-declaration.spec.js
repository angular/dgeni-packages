const matcherFactory = require('./export-named-declaration');

describe('ExportNamedDeclaration matcher', () => {

  let matcher, codeNameServiceMock;

  beforeEach(() => {
    codeNameServiceMock = {
      find(arg) {
        return arg;
      }
    };
    matcher = matcherFactory(codeNameServiceMock);
  });

  it("should start search for right", () => {
    const expr = {
      right: 'right'
    };

    spyOn(codeNameServiceMock, 'find').and.callThrough();

    expect(matcher(expr)).toEqual(expr.right);
    expect(codeNameServiceMock.find.calls.count()).toEqual(1);
    expect(codeNameServiceMock.find).toHaveBeenCalledWith(expr.right);
  });

  it("should return null for empty right", () => {
    spyOn(codeNameServiceMock, 'find').and.callThrough();

    expect(matcher({})).toBeNull();
    expect(codeNameServiceMock.find).toHaveBeenCalledTimes(1);
    expect(codeNameServiceMock.find).toHaveBeenCalledWith(undefined);

    codeNameServiceMock.find.calls.reset();
    expect(matcher({ right: null })).toBeNull();
    expect(codeNameServiceMock.find).toHaveBeenCalledTimes(1);
    expect(codeNameServiceMock.find).toHaveBeenCalledWith(null);

    codeNameServiceMock.find.calls.reset();
    expect(matcher({ right: '' })).toBeNull();
    expect(codeNameServiceMock.find).toHaveBeenCalledTimes(1);
    expect(codeNameServiceMock.find).toHaveBeenCalledWith('');
  });
});
