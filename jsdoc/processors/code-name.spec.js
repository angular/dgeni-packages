var Dgeni = require('dgeni');
var mockPackage = require('../mocks/mockPackage');

describe('code-name doc processor', function() {
  
  var jsParser, processor, mockLog, codeNameService;
  
  beforeEach(function() {
    var dgeni = new Dgeni([mockPackage()]);
    var injector = dgeni.configureInjector();
    codeNameService = injector.get('codeNameService');
    jsParser = injector.get('jsParser');  
    processor = injector.get('codeNameProcessor');
    mockLog = injector.get('log');
  });

  it("should use already existing codeName", function () {
    var doc = { codeName: 'test' };
    processor.$process([doc]);
    expect(doc.codeName).toEqual('test');
    expect(mockLog.silly).toHaveBeenCalledWith('found codeName: ', 'test');
    expect(mockLog.silly.calls.count()).toEqual(1);
  });

  it("should return null for empty codeNode", function () {
    var doc = { };
    processor.$process([doc]);
    expect(doc.codeName).toEqual(null);
    expect(mockLog.silly).not.toHaveBeenCalled();
  });

  it("should process parsed document", function() {
    spyOn(codeNameService, 'find').and.callThrough();
    var ast = jsParser('(function foo() { })()');
    var doc = { codeNode: ast };
    processor.$process([doc]);
    expect(doc.codeName).toEqual('foo');
    expect(codeNameService.find).toHaveBeenCalledWith(jasmine.objectContaining({'type': 'FunctionExpression'}));
  });
});
