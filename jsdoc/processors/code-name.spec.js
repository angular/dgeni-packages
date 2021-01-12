const Dgeni = require('dgeni');
const mockPackage = require('../mocks/mockPackage');

describe('code-name doc processor', () => {

  let jsParser, processor, mockLog, codeNameService;

  beforeEach(() => {
    const dgeni = new Dgeni([mockPackage()]);
    const injector = dgeni.configureInjector();
    codeNameService = injector.get('codeNameService');
    jsParser = injector.get('jsParser');
    processor = injector.get('codeNameProcessor');
    mockLog = injector.get('log');
  });

  it("should use already existing codeName", () => {
    const doc = { codeName: 'test' };
    processor.$process([doc]);
    expect(doc.codeName).toEqual('test');
    expect(mockLog.silly).toHaveBeenCalledWith('found codeName: ', 'test');
    expect(mockLog.silly.calls.count()).toEqual(1);
  });

  it("should return null for empty codeNode", () => {
    const doc = { };
    processor.$process([doc]);
    expect(doc.codeName).toEqual(null);
    expect(mockLog.silly).not.toHaveBeenCalled();
  });

  it("should process parsed document", () => {
    spyOn(codeNameService, 'find').and.callThrough();
    const ast = jsParser('(function foo() { })()');
    const doc = { codeNode: ast };
    processor.$process([doc]);
    expect(doc.codeName).toEqual('foo');
    expect(codeNameService.find).toHaveBeenCalledWith(jasmine.objectContaining({'type': 'FunctionExpression'}));
  });
});
