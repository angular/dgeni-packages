var _ = require('lodash');
var mockPackage = require('../mocks/mockPackage');
var Dgeni = require('dgeni');

describe("generateModuleDocsProcessor", function() {

  var processor, moduleDefs, moduleRegistrationTypes;

  beforeEach(function() {
    var dgeni = new Dgeni([mockPackage()]);
    var injector = dgeni.configureInjector();
    processor = injector.get('generateModuleDocsProcessor');
    moduleDefs = injector.get('moduleDefs');
    moduleRegistrationTypes = injector.get('moduleRegistrationTypes');
  });

  it("should create docs for each module definition", function() {
    var fileInfo = { ast: { comments: [] } };

    moduleDefs.app = { name: 'app', dependencies: [ 'mod1', 'mod2' ], fileInfo: fileInfo };
    moduleDefs.mod1 = { name: 'mod1', dependencies: [], fileInfo: fileInfo  };
    moduleDefs.mod2 = { name: 'mod2', dependencies: [], fileInfo: fileInfo  };

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

    var fileInfo = { ast: { comments: [] } };

    moduleDefs.app = {
      name: 'app',
      dependencies: [ 'mod1', 'mod2' ],
      registrations: {
        controller: [ { name: 'ControllerA', type: _.find(moduleRegistrationTypes, { name: 'controller' }) } ],
        factory: [ { name: 'service1', type: _.find(moduleRegistrationTypes, { name: 'factory' }) } ]
      },
      fileInfo: fileInfo
    };
    moduleDefs.mod1 = {
      name: 'mod1',
      dependencies: [],
      registrations: {
        directive: [ { name: 'directiveX', type: _.find(moduleRegistrationTypes, { name: 'directive' }) }  ],
        filter: []
      },
      fileInfo: fileInfo
    };

    var docs = [];

    processor.$process(docs);

    var groups = _.filter(docs, { docType: 'componentGroup' });
    expect(groups.length).toEqual(3);

    expect(_.find(groups, { id: 'module:app.controllers'})).toEqual(
      jasmine.objectContaining({ docType: 'componentGroup', name: 'controllers' })
    );
    expect(_.find(groups, { id: 'module:app.services'})).toEqual(
      jasmine.objectContaining({ docType: 'componentGroup', name: 'services' })
    );
    expect(_.find(groups, { id: 'module:mod1.directives'})).toEqual(
      jasmine.objectContaining({ docType: 'componentGroup', name: 'directives' })
    );

  });

});
