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

  it("should understand ArrowFunctionExpressions", function() {
    var ast = jsParser("var add = (param) => param + 1;");
    var doc = { codeNode: ast };
    processor.$process([doc]);
    expect(doc.codeName).toEqual('add');
  });

  it("should understand class MethodDefinitions", function() {
    var ast = jsParser("class X { method1() {}; }");
    var doc = { codeNode: ast.body[0].body.body[0] };
    processor.$process([doc]);
    expect(doc.codeName).toEqual('method1');
  });
});
