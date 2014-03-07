var _ = require('lodash');
var logger = require('winston');
var tagDefs = require('../../tag-defs');
var tagParser = require('../../../jsdoc/processors/tag-parser');
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

  function doTransform(doc, name) {
    var tag = doc.tags.getTag(name);
    var tagDef = tag.tagDef;
    return tagDef.transformFn(doc, tag);
  }

  function doDefault(doc, name) {
    var tagDef = _.find(tagDefs, { name: name });
    return tagDef.defaultFn(doc);
  }

  describe("name", function() {

    it("should throw an error if the tag is missing", function() {
      var doc = {
        content: ''
      };

      doc = parseDoc(doc, 0);
      expect(function() {
        doDefault(doc);
      }).toThrow();
    });

    it("should throw error if the docType is 'input' and the name is not a valid format", function() {
      var doc = {
        docType: 'input',
        content: '@name input[checkbox]'
      };
      doc = parseDoc(doc, 0);
      expect(doTransform(doc, 'name')).toEqual('input[checkbox]');
      expect(doc.inputType).toEqual('checkbox');

      doc = {
        docType: 'directive',
        content: '@name input[checkbox]'
      };
      doc = parseDoc(doc, 0);
      expect(doTransform(doc, 'name')).toEqual('input[checkbox]');
      expect(doc.inputType).toBeUndefined();

      doc = {
        docType: 'input',
        content: '@name invalidInputName'
      };
      doc = parseDoc(doc, 0);
      expect(function() {
        doTransform(doc, 'name');
      }).toThrow();
      
    });

  });


  describe("area", function() {

    it("should be 'api' if the fileType is js", function() {
      var doc = {
        content: '',
        fileType: 'js'
      };
      expect(doDefault(doc, 'area')).toEqual('api');
    });

    it("should compute the area from the file name", function() {
      var doc = {
        content: '',
        fileType: 'ngdoc',
        file: 'guide/scope/binding.ngdoc'
      };
      expect(doDefault(doc, 'area')).toEqual('guide');
    });
  });


  describe("module", function() {
    it("extracts the module from the file name if it is from the api area", function() {
      var doc = {
        area: 'api',
        file: 'src/ng/compile.js',
        content: ''
      };
      expect(doDefault(doc, 'module')).toEqual('ng');
    });
  });


  describe("restrict", function() {

    it("should convert a restrict tag text to an object", function() {

      expect(doTransform(parseDoc('@restrict A'), 'restrict'))
        .toEqual({ element: false, attribute: true, cssClass: false, comment: false });

      expect(doTransform(parseDoc('@restrict C'), 'restrict'))
        .toEqual({ element: false, attribute: false, cssClass: true, comment: false });

      expect(doTransform(parseDoc('@restrict E'), 'restrict'))
        .toEqual({ element: true, attribute: false, cssClass: false, comment: false });

      expect(doTransform(parseDoc('@restrict M'), 'restrict'))
        .toEqual({ element: false, attribute: false, cssClass: false, comment: true });

      expect(doTransform(parseDoc('@restrict ACEM'), 'restrict'))
        .toEqual({ element: true, attribute: true, cssClass: true, comment: true });
    });

    it("should default to restricting to an attribute if no tag is found and the doc is for a directive", function() {
      expect(doDefault({ docType: 'directive' }, 'restrict'))
        .toEqual({ element: false, attribute: true, cssClass: false, comment: false });
    });

    it("should not add a restrict property if the docType is not 'directive'", function() {
      expect(doDefault({ docType: 'other' }, 'restrict')).toBeUndefined();
    });
  });


  describe("eventType", function() {

    it("should add an eventTarget property to the doc and return the event type", function() {
      var doc = parseDoc('@eventType broadcast on module:ng.directive:ngInclude');
      expect(doTransform(doc, 'eventType')).toEqual('broadcast');
      expect(doc.eventTarget).toEqual('module:ng.directive:ngInclude');
    });
  });


  describe("element", function() {

    it("should default to ANY if the document is a directive", function() {
      expect(doDefault({ docType: 'directive' }, 'element')).toEqual('ANY');
      expect(doDefault({ docType: 'filter' }, 'element')).toBeUndefined();
    });
  });


});
