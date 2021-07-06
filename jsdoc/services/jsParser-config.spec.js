var Dgeni = require('dgeni');
var mockPackage = require('../mocks/mockPackage');

describe('jsParserConfig service', function() {

  var jsParserConfig;

  beforeEach(function() {
    var dgeni = new Dgeni([mockPackage()])
    var injector = dgeni.configureInjector();
    jsParserConfig = injector.get('jsParserConfig');
  });

  it("checks options required by this implementaion", function() {
    expect(jsParserConfig.comment).toBe(true);
    expect(jsParserConfig.loc).toBe(true);
    expect(jsParserConfig.range).toBe(true);
    expect(jsParserConfig.tokens).toBe(true);
    expect(jsParserConfig.ecmaVersion).toBe(8);
  });
});
