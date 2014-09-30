var _ = require('lodash');
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

    expect(_.filter(docs, { docType: 'ngModule' })).toEqual([
      moduleDefs.app,
      moduleDefs.mod1,
      moduleDefs.mod2
    ]);

    expect(docs[0].docType).toEqual('ngModule');
    expect(docs[0].id).toEqual('module:app');
  });

  it("should add component group docs for each type of component in each module", function() {

    moduleDefs.app = { name: 'app', dependencies: [ 'mod1', 'mod2' ], components: { controller: [ {}, {} ], factory: [ {}, {} ] } };
    moduleDefs.mod1 = { name: 'mod1', dependencies: [], components: { directive: [ {} ], filter: [] } };

    var docs = [];

    processor.$process(docs);

    expect(_.filter(docs, { docType: 'componentGroup' })).toEqual([
      jasmine.objectContaining({ docType: 'componentGroup', name: 'controller', id: 'module:app.group:controller', parent: 'module:app' }),
      jasmine.objectContaining({ docType: 'componentGroup', name: 'factory', id: 'module:app.group:factory', parent: 'module:app' }),
      jasmine.objectContaining({ docType: 'componentGroup', name: 'directive', id: 'module:mod1.group:directive', parent: 'module:mod1' })
    ]);

  });

});