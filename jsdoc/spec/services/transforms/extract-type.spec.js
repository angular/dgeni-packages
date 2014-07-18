var Tag = require('../../../lib/Tag');
var transform = require('../../../tag-defs/transforms/extract-type');

describe("extract-type transform", function() {

  beforeEach(function() {
    doc = {};
    tag = {};
  });

  it("should extract the type from the description", function() {

    value = ' {string} paramName - Some description  \n Some more description';
    value = transform(doc, tag, value);

    expect(tag.typeList).toEqual(['string']);
    expect(value).toEqual('paramName - Some description  \n Some more description');
  });

  it("should return the description if no type is found", function() {
    value = 'paramName - Some description  \n Some more description';
    value = transform(doc, tag, value);
    expect(value).toEqual('paramName - Some description  \n Some more description');
  });
});