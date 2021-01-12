const matcherFactory = require('./property');

describe('Property matcher', () => {

  let matcher, codeNameServiceMock;

  beforeEach(() => {
    codeNameServiceMock = {
      find(arg) {
        return arg;
      }
    };
    matcher = matcherFactory(codeNameServiceMock);
  });

  it("should start search for value", () => {
    const expr = {
      key: 'key',
      value: 'value'
    };

    spyOn(codeNameServiceMock, 'find').and.callThrough();

    expect(matcher(expr)).toEqual(expr.value);
    expect(codeNameServiceMock.find.calls.count()).toEqual(1);
    expect(codeNameServiceMock.find).toHaveBeenCalledWith(expr.value);
  });

  it("should continue search with key", () => {
    codeNameServiceMock.value = null;
    const expr = {
      key: 'key',
      value: null
    };

    spyOn(codeNameServiceMock, 'find').and.callThrough();

    expect(matcher(expr)).toEqual(expr.key);
    expect(codeNameServiceMock.find.calls.count()).toEqual(2);
    expect(codeNameServiceMock.find.calls.allArgs()).toEqual([[null],[expr.key]]);
  });

  it("should return null for empty key and value", () => {
    codeNameServiceMock.value = null;
    const expr = {
      key: null,
      value: null
    };

    spyOn(codeNameServiceMock, 'find').and.callThrough();

    expect(matcher(expr)).toBeNull();
    expect(codeNameServiceMock.find.calls.count()).toEqual(2);
    expect(codeNameServiceMock.find.calls.allArgs()).toEqual([[null],[null]]);
  });
});