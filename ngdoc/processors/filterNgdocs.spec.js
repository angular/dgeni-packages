const mockPackage = require('../mocks/mockPackage');
const Dgeni = require('dgeni');

function createMockTagCollection(tags) {
  return {
    getTag(value) {
      return tags[value];
    }
  };
}


describe("filter-ngdocs doc-processor plugin", () => {
  let processor;

  beforeEach(() => {
    const dgeni = new Dgeni([mockPackage()]);
    const injector = dgeni.configureInjector();
    processor = injector.get('filterNgDocsProcessor');
  });

  it("should only return docs that have the ngdoc tag", () => {

    const doc1 = { tags: createMockTagCollection({ngdoc: 'a'}) };

    const doc2 = { tags: createMockTagCollection({other: 'b'}) };

    const doc3 = { tags: createMockTagCollection({ngdoc: 'c', other: 'd'}) };

    const doc4 = { tags: createMockTagCollection({}) };

    const docs = [ doc1, doc2, doc3, doc4 ];

    const filteredDocs = processor.$process(docs);

    expect(filteredDocs).toEqual([doc1, doc3]);
  });
});