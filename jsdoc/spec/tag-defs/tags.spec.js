var _ = require('lodash');

var TagCollection = require('../../lib/TagCollection');
var Tag = require('../../lib/Tag');

var tagDefs = require('../../tag-defs');
var tagDefMap = require('../../processors/tagDefinitions').exports.tagDefMap[1](tagDefs);

var tagExtractorFactory = require('../../processors/tagExtractor').exports.tagExtractor[1];


describe('tag definitions', function() {

  var tagExtractor;

  beforeEach(function() {
    tagExtractor = tagExtractorFactory(tagDefs);
  });

  describe("memberof", function() {

    it("should throw an exception if the tag exists and docType is not 'event', 'method' or 'property'", function() {
      var tag = new Tag(tagDefMap['memberof'], 'memberof', 'container', 123);
      var doc = createDoc(tag);

      expect(function() {
        tagExtractor(doc);
      }).toThrowError();

    });

    it("should throw an exception if the tag doesn't exist and docType is 'event', 'method' or 'property'", function() {
      var doc = createDoc([]);

      expect(function() {
        doc.docType = 'event';
        tagExtractor(doc);
      }).toThrow();
      expect(function() {
        doc.docType = 'property';
        tagExtractor(doc);
      }).toThrow();
      expect(function() {
        doc.docType = 'method';
        tagExtractor(doc);
      }).toThrow();
    });
  });

  describe("param", function() {

    it("should add param tags to a params array on the doc", function() {
      var tag1 = new Tag(tagDefMap['param'], 'param', '{string} paramName description of param', 123);
      var tag2 = new Tag(tagDefMap['param'], 'param', '{string=} optionalParam description of optional param', 123);
      var tag3 = new Tag(tagDefMap['param'], 'param', '{string} [optionalParam2] description of optional param', 123);
      var tag4 = new Tag(tagDefMap['param'], 'param', '{string} [paramWithDefault=xyz] description of param with default', 123);
      var tag5 = new Tag(tagDefMap['param'], 'param', '{string} paramName|alias description of param with alias', 123);
      var doc = createDoc([tag1, tag2, tag3, tag4, tag5]);

      tagExtractor(doc);

      checkProperty(doc.params[0], 'paramName', 'description of param', ['string']);
      checkProperty(doc.params[1], 'optionalParam', 'description of optional param', ['string'], true);
      checkProperty(doc.params[2], 'optionalParam2', 'description of optional param', ['string'], true);
      checkProperty(doc.params[3], 'paramWithDefault', 'description of param with default', ['string'], true, 'xyz');
      checkProperty(doc.params[4], 'paramName', 'description of param with alias', ['string'], false, undefined, 'alias');
    });
  });


  describe("property", function() {

    it("should transform into a property object", function() {
      var tag = new Tag(tagDefMap['property'], 'property', '{string} propertyName description of property', 123);
      var doc = createDoc(tag);
      tagExtractor(doc);
      checkProperty(doc.properties[0], 'propertyName', 'description of property', ['string']);
    });

  });

  describe("type", function() {

    it("should transform into a type object", function() {
      var tag = new Tag(tagDefMap['type'], 'type', '{string}');
      var doc = createDoc(tag);
      tagExtractor(doc);
      checkProperty(doc.type, undefined, '', ['string']);
    });

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
