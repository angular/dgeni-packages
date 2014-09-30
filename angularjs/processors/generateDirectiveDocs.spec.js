var _ = require('lodash');
var mockPackage = require('../mocks/mockPackage');
var Dgeni = require('dgeni');

describe("generateDirectiveDocsProcessor", function() {

  var processor, moduleDefs;

  beforeEach(function() {
    var dgeni = new Dgeni([mockPackage()]);
    var injector = dgeni.configureInjector();
    processor = injector.get('generateDirectiveDocsProcessor');
  });

  it("should create docs for each directive in each module definition", function() {
    var docs = [
      { docType: 'ngModule', id: 'module:app', name: 'app', dependencies: [ 'mod1', 'mod2' ], components:
        {
          directive: [ { name: 'directive1' } ]
        }
      },
      { docType: 'ngModule', id: 'module:mod1', name: 'mod1', dependencies: [], components:
        {
          directive: [ { name: 'directive2' } ]
        }
      }
    ];

    processor.$process(docs);

    var directiveDocs = _.filter(docs, { docType: 'ngDirective' });
    expect(directiveDocs[0]).toEqual(
      jasmine.objectContaining({ docType: 'ngDirective', id: 'module:app.directive:directive1', name: 'directive1', parent: 'module:app.group:directive' })
    );
    expect(directiveDocs[1]).toEqual(
      jasmine.objectContaining({ docType: 'ngDirective', id: 'module:mod1.directive:directive2', name: 'directive2', parent: 'module:mod1.group:directive' })
    );
  });

});