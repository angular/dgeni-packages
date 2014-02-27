var plugin = require('../../processors/filter-ngdocs');
var TagCollection = require('../../../jsdoc/lib/TagCollection');
var Tag = require('../../../jsdoc/lib/Tag');

function addTag(doc, name, description) {
  doc.tags.addTag({ tagDef: {name: name}, name: name, description: description});
}

describe("filter-ngdocs doc-processor plugin", function() {
  it("should only return docs that have the ngdoc tag", function() {

    var doc1 = { tags: new TagCollection() };
    addTag(doc1, 'ngdoc', 'a');

    var doc2 = { tags: new TagCollection() };
    addTag(doc2, 'other', 'b');

    var doc3 = { tags: new TagCollection() };
    addTag(doc3, 'ngdoc', 'c');
    addTag(doc3, 'other', 'd');

    var doc4 = { tags: new TagCollection() };

    var docs = [ doc1, doc2, doc3, doc4 ];

    var filteredDocs = plugin.process(docs);

    expect(filteredDocs).toEqual([doc1, doc3]);
  });
});