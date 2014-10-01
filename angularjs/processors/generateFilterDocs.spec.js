var _ = require('lodash');
var mockPackage = require('../mocks/mockPackage');
var Dgeni = require('dgeni');

describe("generateFilterDocsProcessor", function() {

  var processor, moduleDefs;

  beforeEach(function() {
    var dgeni = new Dgeni([mockPackage()]);
    var injector = dgeni.configureInjector();
    processor = injector.get('generateFilterDocsProcessor');
  });

  it("should create docs for each module definition", function() {
    var docs = [
      { docType: 'ngModule', id: 'module:app', name: 'app', dependencies: [ 'mod1', 'mod2' ], components:
        {
          filter: [ { name: 'uppercase' } ]
        }
      },
      { docType: 'ngModule', id: 'module:mod1', name: 'mod1', dependencies: [], components:
        {
          filter: [ { name: 'title' } ]
        }
      }
    ];

    processor.$process(docs);

    var filterDocs = _.filter(docs, { docType: 'ngFilter' });
    expect(filterDocs).toEqual([
      jasmine.objectContaining({ docType: 'ngFilter', id: 'module:app.filter:uppercase', name: 'uppercase', parent: 'module:app.group:filter' }),
      jasmine.objectContaining({ docType: 'ngFilter', id: 'module:mod1.filter:title', name: 'title', parent: 'module:mod1.group:filter' }),
    ]);
  });

});