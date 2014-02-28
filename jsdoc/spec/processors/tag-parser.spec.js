var plugin = require('../../processors/tag-parser');
var config = require('dgeni/lib/utils/config').Config;

describe("tag-parser doc processor plugin", function() {

  beforeEach(function() {
    config.set('processing.tagDefinitions', [
      { name: 'ngdoc' },
      { name: 'description' },
      { name: 'param', canHaveName: true, canHaveType: true }
    ]);
    plugin.init(config);
  });

  it("should have name 'tag-parser", function() {
    expect(plugin.name).toEqual('tag-parser');
  });
  

  it("should parse the content of the document and attach a tags property to the doc", function() {
    var doc = {
      content: 'some content\n@ngdoc directive\n@description Some description info\n@param {function(*)|string|Array.<(function(*)|string)>} abc',
      startingLine: 245
    };
    plugin.process([doc]);
    expect(doc.tags).toBeDefined();
    expect(doc.tags.description).toEqual('some content');
    expect(doc.tags.getTag('ngdoc')).toEqual(jasmine.objectContaining({ tagName: 'ngdoc', description: 'directive' }));
    expect(doc.tags.getTag('description')).toEqual(jasmine.objectContaining({ tagName: 'description', description: 'Some description info' }));
    expect(doc.tags.getTag('param')).toEqual(jasmine.objectContaining({ tagName: 'param', description: ''}));
  });

  it("should parse the typeExpression into an object tree", function() {
    var doc = {
      content: '@param {function(*)|string|Array.<(function(*)|string)>} abc',
      startingLine: 245
    };
    plugin.process([doc]);
    var tag = doc.tags.getTag('param');
    expect(tag.typeExpression).toEqual('function(*)|string|Array.<(function(*)|string)>');
    expect(tag.type.type).toEqual('TypeUnion');
    expect(tag.type.elements).toEqual([
      { type : 'FunctionType', params : [ { type : 'AllLiteral' } ] },
      { type : 'NameExpression', name : 'string' },
      {
        type : 'TypeApplication',
        expression : { type : 'NameExpression', name : 'Array' },
        applications : [
          {
            type : 'TypeUnion',
            elements : [
              { type : 'FunctionType', params : [ { type : 'AllLiteral' } ] },
              { type : 'NameExpression', name : 'string' }
            ]
          }
        ]
      }
    ]);
  });

  it("should convert a simple type into an object", function() {
    var doc = {
      content: '@param {string} abc',
      startingLine: 1
    };
    plugin.process([doc]);
    expect(doc.tags.getTag('param').type).toEqual(jasmine.objectContaining(
      { type : 'NameExpression', name : 'string' }));
  });

  it("should convert an optional type into an object", function() {
    var doc = {
      content: '@param {string=} abc',
      startingLine: 1
    };
    plugin.process([doc]);
    expect(doc.tags.getTag('param').type).toEqual(jasmine.objectContaining({
      type: 'NameExpression', name: 'string', optional: true
    }));
  });

  it("should a simple array of top level types in the typeList property", function() {
    var doc = {
      content: '@param {function(*)|string|Array.<(function(*)|string)>} abc',
      startingLine: 245
    };
    plugin.process([doc]);
    var tag = doc.tags.getTag('param');
    expect(tag.typeList).toEqual([
      'function(*)',
      'string',
      'Array.<(function(*)|string)>'
    ]);
  });

});