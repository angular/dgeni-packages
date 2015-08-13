var Dgeni = require('dgeni');
var mockPackage = require('../mocks/mockPackage');

var mockLog = jasmine.createSpyObj('log', ['error', 'warn', 'info', 'debug', 'silly']);

describe('code-name doc processor', function() {
  
  var jsParser, processor;
  
  beforeEach(function() {
    var dgeni = new Dgeni([mockPackage()]);
    var injector = dgeni.configureInjector();
    jsParser = injector.get('jsParser');  
    processor = injector.get('codeNameProcessor');
  });
  
  it("should understand CallExpressions", function() {
    var ast = jsParser('(function foo() { })()');
    var doc = { codeNode: ast };
    processor.$process([doc]);
    expect(doc.codeName).toEqual('foo');
  });

  it("should understand ArrayExpressions", function() {
    var ast = jsParser("$CompileProvider.$inject = ['$provide', '$$sanitizeUriProvider'];");
    var doc = { codeNode: ast };
    processor.$process([doc]);
    expect(doc.codeName).toEqual('$inject');
  });

});