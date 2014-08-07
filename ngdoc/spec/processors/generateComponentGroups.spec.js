var _ = require('lodash');
var processorFactory = require('../../processors/generateComponentGroups');

describe("generateComponentGroupsProcessor", function() {
  it("should create a new doc for each group of components (by docType) in each module", function() {
    var docs = [];
    var modules = [{
      id: 'mod1',
      name: 'mod1',
      components: [
        { docType: 'a', id: 'a1' },
        { docType: 'a', id: 'a2' },
        { docType: 'a', id: 'a3' },
        { docType: 'a', id: 'a4' },
        { docType: 'b', id: 'b1' },
        { docType: 'b', id: 'b2' },
        { docType: 'b', id: 'a3' }
      ]
    }];
    var mockApiDocsProcessor = {
      apiDocsPath: 'partials'
    };

    var processor = processorFactory(modules, mockApiDocsProcessor);
    processor.$process(docs);

    expect(docs.length).toEqual(2);

    expect(docs[0].moduleName).toEqual('mod1');
    expect(docs[0].moduleDoc).toEqual(jasmine.objectContaining({ id: 'mod1' }));
  });
});