const matcherFactory = require('./assignment-expression');

describe('AssignmentExpression matcher', () => {

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
      left: 'left',
      right: 'right'
    };

    spyOn(codeNameServiceMock, 'find').and.callThrough();

    expect(matcher(expr)).toEqual(expr.right);
    expect(codeNameServiceMock.find.calls.count()).toEqual(1);
    expect(codeNameServiceMock.find).toHaveBeenCalledWith(expr.right);
  });

  it("should continue search with left", () => {
    codeNameServiceMock.value = null;
    const expr = {
      left: 'test',
      right: null
    };

    spyOn(codeNameServiceMock, 'find').and.callThrough();

    expect(matcher(expr)).toEqual(expr.left);
    expect(codeNameServiceMock.find.calls.count()).toEqual(2);
    expect(codeNameServiceMock.find.calls.allArgs()).toEqual([[null],[expr.left]]);
  });

  it("should return null for empty left and right", () => {
    codeNameServiceMock.value = null;
    const expr = {
      left: null,
      right: null
    };

    spyOn(codeNameServiceMock, 'find').and.callThrough();

    expect(matcher(expr)).toBeNull();
    expect(codeNameServiceMock.find.calls.count()).toEqual(2);
    expect(codeNameServiceMock.find.calls.allArgs()).toEqual([[null],[null]]);
  });
});