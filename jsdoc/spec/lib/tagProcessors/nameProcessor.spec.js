var Tag = require('../../../lib/Tag');
var nameProcessor = require('../../../lib/tagProcessors/nameProcessor');

describe("nameProcessor", function() {

  var tagDef;

  beforeEach(function() {
    tagDef = {
      name: 'someTag',
      canHaveName: true
    };
  });

  it("should extract the name from the description", function() {
    
    var tag = new Tag(tagDef, 'someTag', '   paramName - Some description  \n Some more description', 0);
    nameProcessor(tag);
    expect(tag.name).toEqual('paramName');
    expect(tag.description).toEqual('Some description  \n Some more description');
  });

  it("should extract an optional name", function() {
    var tag = new Tag(tagDef, 'someTag', '[someName]', 0);
    nameProcessor(tag);
    expect(tag.name).toEqual('someName');
    expect(tag.optional).toEqual(true);
  });

  it("should extract a name and its default value", function() {
    var tag = new Tag(tagDef, 'someTag', '[someName=someDefault]', 0);
    nameProcessor(tag);
    expect(tag.name).toEqual('someName');
    expect(tag.optional).toEqual(true);
    expect(tag.defaultValue).toEqual('someDefault');
    expect(tag.description).toEqual('');
  });

  it("should extract a param name alias", function() {
    var tag = new Tag(tagDef, 'someTag', 'paramName|aliasName some description', 0);
    nameProcessor(tag);
    expect(tag.name).toEqual('paramName');
    expect(tag.alias).toEqual('aliasName');
    expect(tag.description).toEqual('some description');
  });

});