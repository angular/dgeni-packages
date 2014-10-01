var _ = require('lodash');
var mockPackage = require('../mocks/mockPackage');
var Dgeni = require('dgeni');

describe("generateControllerDocsProcessor", function() {

  var processor, moduleDefs;

  beforeEach(function() {
    var dgeni = new Dgeni([mockPackage()]);
    var injector = dgeni.configureInjector();
    processor = injector.get('generateControllerDocsProcessor');
  });

  it("should create docs for each controller in each module definition", function() {

    var docs = [
      { docType: 'ngModule', id: 'module:app', name: 'app', dependencies: [ 'mod1', 'mod2' ], components:
        {
          controller: [ { name: 'Controller1' } ]
        }
      },
      { docType: 'ngModule', id: 'module:mod1', name: 'mod1', dependencies: [], components:
        {
          controller: [ { name: 'Controller2' } ]
        }
      }
    ];

    processor.$process(docs);

    var controllerDocs = _.filter(docs, { docType: 'ngController' });
    expect(controllerDocs[0]).toEqual(
      jasmine.objectContaining({ docType: 'ngController', id: 'module:app.controller:Controller1', name: 'Controller1', parent: 'module:app.group:controller' })
    );
    expect(controllerDocs[1]).toEqual(
      jasmine.objectContaining({ docType: 'ngController', id: 'module:mod1.controller:Controller2', name: 'Controller2', parent: 'module:mod1.group:controller' })
    );
  });

});