var tagDefMapFactory = require('../../services/tagDefMap');

describe("tagDefMap", function() {

  it("should add the tag definitions to the map", function() {
    var tagDefinitions = [
      { name: 'def1' },
      { name: 'def2' }
    ];
    var tagDefMap = tagDefMapFactory(tagDefinitions);
    expect(tagDefMap.get('def1')).toBe(tagDefinitions[0]);
    expect(tagDefMap.get('def2')).toBe(tagDefinitions[1]);
  });


  it("should add aliases of tag definitions to the map", function() {
    var tagDefinitions = [
      { name: 'def1', aliases: ['alias1'] },
      { name: 'def2', aliases: ['alias2a', 'alias2b'] }
    ];
    var tagDefMap = tagDefMapFactory(tagDefinitions);
    expect(tagDefMap.get('alias1')).toBe(tagDefinitions[0]);
    expect(tagDefMap.get('alias2a')).toBe(tagDefinitions[1]);
    expect(tagDefMap.get('alias2b')).toBe(tagDefinitions[1]);
  });

});