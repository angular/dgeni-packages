var _ = require('lodash');
var mockPackage = require('../mocks/mockPackage');
var Dgeni = require('dgeni');

describe("generateServiceComponentDocsProcessor", function() {

  var processor, moduleDefs;

  beforeEach(function() {
    var dgeni = new Dgeni([mockPackage()]);
    var injector = dgeni.configureInjector();
    processor = injector.get('generateServiceComponentDocsProcessor');
  });

  it("should create docs for each service component in each module", function() {
    var docs = [
      { docType: 'ngModule', id: 'module:app', name: 'app', dependencies: [ 'mod1', 'mod2' ], components:
        {
          value: [ { name: 'Value1' } ],
          factory: [ { name: 'Service1' } ]
        }
      },
      { docType: 'ngModule', id: 'module:mod1', name: 'mod1', dependencies: [], components:
        {
          service: [ { name: 'Service2' } ],
          constant: [ { name: 'Constant1'} ]
        }
      }
    ];

    processor.$process(docs);

    var valueDocs = _.filter(docs, { docType: 'ngService' });

    expect(valueDocs[0]).toEqual(
      jasmine.objectContaining({ docType: 'ngService', serviceType: 'factory', id: 'module:app.service:Service1', name: 'Service1', parent: 'module:app.group:factory' })
    );
    expect(valueDocs[1]).toEqual(
      jasmine.objectContaining({ docType: 'ngService', serviceType: 'value', id: 'module:app.service:Value1', name: 'Value1', parent: 'module:app.group:value' })
    );
    expect(valueDocs[2]).toEqual(
      jasmine.objectContaining({ docType: 'ngService', serviceType: 'service', id: 'module:mod1.service:Service2', name: 'Service2', parent: 'module:mod1.group:service' })
    );
    expect(valueDocs[3]).toEqual(
      jasmine.objectContaining({ docType: 'ngService', serviceType: 'constant', id: 'module:mod1.service:Constant1', name: 'Constant1', parent: 'module:mod1.group:constant' })
    );
  });

});