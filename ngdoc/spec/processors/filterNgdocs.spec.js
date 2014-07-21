var processorFactory = require('../../processors/filterNgdocs');
var mockLog = require('dgeni/lib/mocks/log')(false);

function createMockTagCollection(tags) {
  return {
    getTag: function(value) {
      return tags[value];
    }
  };
}


describe("filter-ngdocs doc-processor plugin", function() {
  it("should only return docs that have the ngdoc tag", function() {

    var doc1 = { tags: createMockTagCollection({ngdoc: 'a'}) };

    var doc2 = { tags: createMockTagCollection({other: 'b'}) };

    var doc3 = { tags: createMockTagCollection({ngdoc: 'c', other: 'd'}) };

    var doc4 = { tags: createMockTagCollection({}) };

    var docs = [ doc1, doc2, doc3, doc4 ];

    var processor = processorFactory(mockLog);
    var filteredDocs = processor.$process(docs);

    expect(filteredDocs).toEqual([doc1, doc3]);
  });
});