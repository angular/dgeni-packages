var tagDefinitionsProcessor = require('../../processors/tagDefinitions');
var Config = require('dgeni').Config;

describe("tagDefinitions helper", function() {
  it("should extract the tagDefinitions from the config", function() {
    var tagDef1 = { name: 'tagDef1' };
    var tagDef2 = { name: 'tagDef2' };

    var config = new Config({
      processing: {
        tagDefinitions: [ tagDef1, tagDef2 ]
      }
    });

    var tagDefinitions = tagDefinitionsProcessor.exports.tagDefinitions[1](config);
    expect(tagDefinitions).toEqual([ tagDef1, tagDef2 ]);
  });

  it("should error if the config does not contain any tag definitions", function() {
    expect(function() {
      tagDefinitionsProcessor.exports.tagDefinitionsp[1](new Config());
    }).toThrow();
  });

  it("should create a map of the tagDefinitions", function() {
    var tagDef1 = { name: 'tagDef1', aliases: [ 'tagDefA' ] };
    var tagDef2 = { name: 'tagDef2' };
    var tagDef3 = { name: 'tagDef3', aliases: [ 'tagDefB'] };

    var tagDefinitions = [ tagDef1, tagDef2, tagDef3 ];
    var tagDefMap = tagDefinitionsProcessor.exports.tagDefMap[1](tagDefinitions);
    expect(tagDefMap.tagDef1).toEqual(tagDef1);
    expect(tagDefMap.tagDef2).toEqual(tagDef2);
    expect(tagDefMap.tagDef3).toEqual(tagDef3);
    expect(tagDefMap.tagDefA).toEqual(tagDef1);
    expect(tagDefMap.tagDefB).toEqual(tagDef3);
  });
});