var _ = require('lodash');

var TagCollection = require('../../lib/TagCollection');
var Tag = require('../../lib/Tag');

var tagDefs = require('../../tag-defs');

var tagExtractorFactory = require('../../processors/tagExtractor').exports.tagExtractor[1];


describe('tag definitions', function() {

  var tagExtractor;

  beforeEach(function() {
    tagExtractor = tagExtractorFactory(tagDefs);
  });

  describe("returns/return", function() {

    it("should transform into a returns object", function() {
      var tag = new Tag(tagDefMap['returns'], 'returns', '{string} description of returns');
      var doc = createDoc(tag);
      tagExtractor(doc);
      checkProperty(doc.returns, undefined, 'description of returns', ['string']);
    });

  });


});

function checkProperty(prop, name, description, typeList, isOptional, defaultValue, alias) {
  expect(prop.name).toEqual(name);
  expect(prop.description).toEqual(description);
  expect(prop.typeList).toEqual(typeList);
  if ( isOptional ) {
    expect(prop.optional).toBeTruthy();
  } else {
    expect(prop.optional).toBeFalsy();
  }
  expect(prop.defaultValue).toEqual(defaultValue);
  expect(prop.alias).toEqual(alias);
}

function createDoc(tags) {
  if ( !_.isArray(tags)) { tags = [tags]; }
  return {
    tags: new TagCollection(tags)
  };
}
