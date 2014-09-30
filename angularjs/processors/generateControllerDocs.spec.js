var mockPackage = require('../mocks/mockPackage');
var Dgeni = require('dgeni');

describe("generateModuleDocsProcessor", function() {

  var processor, moduleDefs;

  beforeEach(function() {
    var dgeni = new Dgeni([mockPackage()]);
    var injector = dgeni.configureInjector();
    processor = injector.get('generateModuleDocsProcessor');
    moduleDefs = injector.get('moduleDefs');
  });

  it("should create docs for each module definition", function() {
    moduleDefs.app = { name: 'app', dependencies: [ 'mod1', 'mod2' ] };
    moduleDefs.mod1 = { name: 'mod1', dependencies: [] };
    moduleDefs.mod2 = { name: 'mod2', dependencies: [] };

    var docs = [];
    processor.$process(docs);

    expect(docs).toEqual([
      moduleDefs.app,
      moduleDefs.mod1,
      moduleDefs.mod2
    ]);

    expect(docs[0].docType).toEqual('ngModule');
    expect(docs[0].id).toEqual('module:app');
  });

});