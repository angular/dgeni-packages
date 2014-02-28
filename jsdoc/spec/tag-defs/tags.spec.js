var _ = require('lodash');
var logger = require('winston');
var tagDefs = require('../../tag-defs');
var tagParser = require('../../processors/tag-parser');
var config = require('dgeni/lib/utils/config').Config;

describe('tag definitions', function() {

  function parseDoc(content) {
    var doc;
    config.set('processing.tagDefinitions', tagDefs);
    tagParser.init(config);

    if ( _.isString(content) ) {
      doc = {
        basePath: '.',
        file: 'src/some.js',
        fileType: 'js'
      };
      doc.content = content;
    } else {
      doc = content;
    }
    tagParser.process([doc]);
    return doc;
  }

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

  function doTransform(doc, tag) {
    var tagDef = tag.tagDef;
    return tagDef.transformFn(doc, tag);
  }

  function doDefault(doc, name) {
    var tagDef = _.find(tagDefs, { name: name });
    return tagDef.defaultFn(doc);
  }


  describe("memberof", function() {

    it("should throw an exception if the tag exists and docType is not 'event', 'method' or 'property'", function() {
      var doc = parseDoc("@memberof container");
      var tag = doc.tags.getTag('memberof');
      expect(function() {
        tag.tagDef.transformFn(doc, tag);
      }).toThrow();
    });

    it("should throw an exception if the tag doesn't exist and docType is 'event', 'method' or 'property'", function() {
      var doc = parseDoc("empty content");
      expect(function() {
        doc.docType = 'event';
        doDefault(doc, 'memberof');
      }).toThrow();
      expect(function() {
        doc.docType = 'property';
        doDefault(doc, 'memberof');
      }).toThrow();
      expect(function() {
        doc.docType = 'method';
        doDefault(doc, 'memberof');
      }).toThrow();
    });
  });

  describe("param", function() {
    
    it("should add param tags to a params array on the doc", function() {
      var doc = parseDoc(
        "@param {string} paramName description of param\n" +
        "@param {string=} optionalParam description of optional param\n" +
        "@param {string} [optionalParam2] description of optional param\n" +
        "@param {string} [paramWithDefault=xyz] description of param with default\n" +
        "@param {string} paramName|alias description of param with alias\n"
      );

      var paramTags = doc.tags.getTags('param');

      var param = doTransform(doc, paramTags[0]);
      checkProperty(param, 'paramName', 'description of param', ['string']);

      param = doTransform(doc, paramTags[1]);
      checkProperty(param, 'optionalParam', 'description of optional param', ['string'], true);

      param = doTransform(doc, paramTags[2]);
      checkProperty(param, 'optionalParam2', 'description of optional param', ['string'], true);

      param = doTransform(doc, paramTags[3]);
      checkProperty(param, 'paramWithDefault', 'description of param with default', ['string'], true, 'xyz');

      param = doTransform(doc, paramTags[4]);
      checkProperty(param, 'paramName', 'description of param with alias', ['string'], false, undefined, 'alias');
    });
  });


  describe("property", function() {

    it("should transform into a property object", function() {
      var doc = parseDoc("@property {string} propertyName description of property");
      var tag = doc.tags.getTag('property');
      var property = doTransform(doc, tag);
      checkProperty(property, 'propertyName', 'description of property', ['string']);
    });

  });


  describe("returns/return", function() {

    it("should transform into a returns object", function() {
      var doc = parseDoc("@returns {string} description of returns");
      var tag = doc.tags.getTag('returns');
      var returns = doTransform(doc, tag);
      checkProperty(returns, undefined, 'description of returns', ['string']);
    });

  });


});
