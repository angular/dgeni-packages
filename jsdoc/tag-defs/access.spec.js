var tagDefFactory = require('./access');

describe("access tagDef", function() {

  function createDocMessage(message, doc) {
    return message;
  }

  function createDoc() {
    return {
      tags: { getTags: function() { return []; } }
    };
  }

  it("should have correct name and property", function() {
    var tagDef = tagDefFactory(createDocMessage);

    expect(tagDef.name).toEqual('access');
  });

  it("should add only the standard access types (private, protected, public) as a property on the doc", function() {
    var doc;
    var tagDef = tagDefFactory(createDocMessage);

    doc = createDoc();
    tagDef.transforms(doc, {}, 'private');
    expect(doc.private).toEqual(true);

    doc = createDoc();
    tagDef.transforms(doc, {}, 'protected');
    expect(doc.protected).toEqual(true);

    doc = createDoc();
    tagDef.transforms(doc, {}, 'public');
    expect(doc.public).toEqual(true);

    doc = createDoc();
    tagDef.transforms(doc, {}, 'custom');
    expect(doc.custom).toBeUndefined();
  });


  it("should add an access property containing the value of the tag", function() {
    var doc, tag;
    var tagDef = tagDefFactory(createDocMessage);

    doc = createDoc();
    var value = tagDef.transforms(doc, {}, 'private');
    expect(value).toEqual('private');

    doc = createDoc();
    var value = tagDef.transforms(doc, {}, 'custom');
    expect(value).toEqual('custom');
  });


  it("should throw an error if the doc already contains an associated explicit standard tag", function() {
    var doc, tag;
    var tagDef = tagDefFactory(createDocMessage);

    doc = createDoc();
    doc.tags.getTags = function() { return [ { /* Mock private tag */}] }
    expect(function() {
      tagDef.transforms(doc, {}, 'private');
    }).toThrowError('"@access private" tag cannot be used with "@private" tag on the same document');
  });
});