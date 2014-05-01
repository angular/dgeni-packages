var _ = require('lodash');
var TagCollection = require('../../../jsdoc/lib/TagCollection');
var Tag = require('../../../jsdoc/lib/Tag');

var tagDefs = require('../../tag-defs');
var tagDefMap = require('../../../jsdoc/processors/tagDefinitions').exports.tagDefMap[1](tagDefs);

var tagExtractorFactory = require('../../../jsdoc/processors/tagExtractor').exports.tagExtractor[1];

describe('tag definitions', function() {

  var tagExtractor, nameTag, ngdocTag;

  beforeEach(function() {
    tagExtractor = tagExtractorFactory(tagDefs);
    nameTag = new Tag(tagDefMap['name'], 'name', 'some-name', 123);
    ngdocTag = new Tag(tagDefMap['ngdoc'], 'ngdoc', 'directive', 123);
  });

  describe("name", function() {

    it("should throw an error if the tag is missing", function() {
      var doc = createDoc([ngdocTag]);
      expect(function() {
        tagExtractor(doc);
      }).toThrow();
    });

    it("should update the inputType if docType is input", function() {

      nameTag.description = 'input[checkbox]';
      ngdocTag.description = 'input';
      var doc = createDoc([nameTag, ngdocTag]);
      tagExtractor(doc);
      expect(doc.name).toEqual('input[checkbox]');
      expect(doc.inputType).toEqual('checkbox');
    });

    it("should not update the inputType if docType is not input", function() {

      nameTag.description = 'input[checkbox]';
      ngdocTag.description = 'directive';
      var doc = createDoc([nameTag, ngdocTag]);
      tagExtractor(doc);
      expect(doc.name).toEqual('input[checkbox]');
      expect(doc.inputType).toBeUndefined();

    });

    it("should throw error if the docType is 'input' and the name is not a valid format", function() {

      nameTag.description = 'invalidInputName';
      ngdocTag.description = 'input';
      var doc = createDoc([nameTag, ngdocTag]);
      expect(function() {
        tagExtractor(doc);
      }).toThrow();

    });

  });


  describe("area", function() {

    it("should be 'api' if the fileType is js", function() {

      var doc = createDoc([nameTag, ngdocTag]);
      tagExtractor(doc);
      expect(doc.area).toEqual('api');
    });

    it("should compute the area from the file name", function() {
      var doc = createDoc([nameTag, ngdocTag], 'guide/scope/binding.ngdoc', 'ngdoc');
      tagExtractor(doc);
      expect(doc.area).toEqual('guide');
    });
  });


  describe("module", function() {
    it("extracts the module from the file name if it is from the api area", function() {
      var doc = createDoc([nameTag, ngdocTag]);
      tagExtractor(doc);
      expect(doc.module).toEqual('ng');
    });
  });


  describe("restrict", function() {

    it("should convert a restrict tag text to an object", function() {

      var restrictTag = new Tag(tagDefMap['restrict'], 'restrict', '', 123);

      var doc = createDoc([nameTag, ngdocTag, restrictTag]);

      restrictTag.description = 'A';
      tagExtractor(doc);
      expect(doc.restrict)
        .toEqual({ element: false, attribute: true, cssClass: false, comment: false });

      restrictTag.description = 'C';
      tagExtractor(doc);
      expect(doc.restrict)
        .toEqual({ element: false, attribute: false, cssClass: true, comment: false });

      restrictTag.description = 'E';
      tagExtractor(doc);
      expect(doc.restrict)
        .toEqual({ element: true, attribute: false, cssClass: false, comment: false });

      restrictTag.description = 'M';
      tagExtractor(doc);
      expect(doc.restrict)
        .toEqual({ element: false, attribute: false, cssClass: false, comment: true });

      restrictTag.description = 'ACEM';
      tagExtractor(doc);
      expect(doc.restrict)
        .toEqual({ element: true, attribute: true, cssClass: true, comment: true });
    });

    it("should default to restricting to an attribute if no tag is found and the doc is for a directive", function() {
      var doc = createDoc([nameTag, ngdocTag]);
      tagExtractor(doc);
      expect(doc.restrict)
        .toEqual({ element: false, attribute: true, cssClass: false, comment: false });
    });

    it("should not add a restrict property if the docType is not 'directive'", function() {
      var doc = createDoc([nameTag, ngdocTag]);
      ngdocTag.description = 'other';
      tagExtractor(doc);
      expect(doc.restrict).toBeUndefined();
    });
  });


  describe("eventType", function() {

    it("should add an eventTarget property to the doc and return the event type", function() {
      var eventTag = new Tag(tagDefMap['eventType'], 'eventType', 'broadcast on module:ng.directive:ngInclude', 123);
      var doc = createDoc([nameTag, ngdocTag, eventTag]);
      tagExtractor(doc);
      expect(doc.eventType).toEqual('broadcast');
      expect(doc.eventTarget).toEqual('module:ng.directive:ngInclude');
    });
  });


  describe("element", function() {

    it("should default to ANY if the document is a directive", function() {
      var doc = createDoc([nameTag, ngdocTag]);

      ngdocTag.description = 'directive';
      tagExtractor(doc);
      expect(doc.element).toEqual('ANY');
    });

    it("should be undefined if the document is not a directive", function() {
      var doc = createDoc([nameTag, ngdocTag]);
      ngdocTag.description = 'filter';
      tagExtractor(doc);
      expect(doc.element).toBeUndefined();
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

function createDoc(tags, file, fileType) {
  if ( !_.isArray(tags)) { tags = [tags]; }
  return {
    tags: new TagCollection(tags),
    file: file || 'src/ng/compile.js',
    fileType: fileType || 'js'
  };
}
