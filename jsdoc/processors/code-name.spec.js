var Dgeni = require('dgeni');
var mockPackage = require('../mocks/mockPackage');

describe('code-name doc processor', function() {
  var processor, jsParser;

  beforeEach(function() {
    var dgeni = new Dgeni([mockPackage()]);
    var injector = dgeni.configureInjector();

    processor = injector.get('codeNameProcessor');
    jsParser = injector.get('jsParser');
  });

  it("should understand CallExpressions", function() {
    var ast = jsParser.parse('(function foo() { })()');
    var doc = { codeNode: ast };
    processor.$process([doc]);
    expect(doc.codeName).toEqual('foo');
  });

  it("should understand ArrayExpressions", function() {
    var ast = jsParser.parse("$CompileProvider.$inject = ['$provide', '$$sanitizeUriProvider'];");
    var doc = { codeNode: ast };
    processor.$process([doc]);
    expect(doc.codeName).toEqual('$inject');
  });

});