var extractTagsFactory = require('../../lib/extract-tags');
var TagCollection = require('../../lib/TagCollection');
var Tag = require('../../lib/Tag');

describe("extract-tags", function() {

  it("should extract the tag and apply it to the doc", function() {
    var tagDefs = [
      { name: 'id' },
      { name: 'multi', docProperty: 'multiHolder', multi: true },
      { name: 'multiWithDefault', defaultFn: function() { return 'defaultValue'; }, multi: true }
    ];
    var tags = new TagCollection();
    var idTag = new Tag(tagDefs[0], 'id', 'some.id', 123);
    tags.addTag(idTag);
    var multiTag1 = new Tag(tagDefs[1], 'multi', 'multi1', 125);
    tags.addTag(multiTag1);
    var multiTag2 = new Tag(tagDefs[1], 'multi', 'multi2', 125);
    tags.addTag(multiTag2);

    var extractTags = extractTagsFactory(tagDefs);
    var doc = { tags: tags };
    extractTags(doc);

    expect(doc.id).toEqual('some.id');
    expect(doc.multiHolder).toEqual([ 'multi1', 'multi2']);
    expect(doc.multiWithDefault).toEqual([ 'defaultValue' ]);
  });

  it("should accept a non-undefined, falsy value from a defaultFn", function() {
    var extractTags = extractTagsFactory([
      { name: 'priority', defaultFn: function(doc) { return 0; } }
    ]);
    var doc = {
      tags: {
        getTags: function() { return []; }
      }
    };
    extractTags(doc);
    expect(doc.priority).toBe(0);
  });
  
});