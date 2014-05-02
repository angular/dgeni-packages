var processor = require('../../processors/code-name');
var jsParser = require('esprima');

describe('code-name doc processor', function() {
  it("should understand CallExpressions", function() {
    var ast = jsParser.parse('(function foo() { })()');
    var doc = { codeNode: { node: ast } };
    processor.process([doc]);
    expect(doc.codeName).toEqual('foo');
  });

  it("should understand ArrayExpressions", function() {
    var ast = jsParser.parse("$CompileProvider.$inject = ['$provide', '$$sanitizeUriProvider'];");
    var doc = { codeNode: { node: ast } };
    processor.process([doc]);
    expect(doc.codeName).toEqual('$inject');
  });

});