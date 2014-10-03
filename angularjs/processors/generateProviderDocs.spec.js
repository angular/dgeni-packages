var _ = require('lodash');
var mockPackage = require('../mocks/mockPackage');
var Dgeni = require('dgeni');

describe("generateProviderDocsProcessor", function() {

  var processor, moduleDefs;

  beforeEach(function() {
    var dgeni = new Dgeni([mockPackage()]);
    var injector = dgeni.configureInjector();
    processor = injector.get('generateProviderDocsProcessor');
  });

  it("should create docs for each provider in each module definition", function() {

    var docs = [
      { docType: 'ngModule', id: 'module:app', name: 'app', dependencies: [ 'mod1', 'mod2' ], registrations:
        {
          provider: [ { name: 'service1' } ]
        }
      },
      { docType: 'ngModule', id: 'module:mod1', name: 'mod1', dependencies: [], registrations:
        {
          provider: [ { name: 'service2' } ]
        }
      }
    ];

    processor.$process(docs);

    var providerDocs = _.filter(docs, { docType: 'ngProvider' });
    expect(providerDocs[0]).toEqual(
      jasmine.objectContaining({ docType: 'ngProvider', id: 'module:app.provider:service1Provider', name: 'service1Provider', parent: 'module:app.group:provider' })
    );
    expect(providerDocs[1]).toEqual(
      jasmine.objectContaining({ docType: 'ngProvider', id: 'module:mod1.provider:service2Provider', name: 'service2Provider', parent: 'module:mod1.group:provider' })
    );
  });

});