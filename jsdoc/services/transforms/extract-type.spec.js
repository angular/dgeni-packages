var transformFactory = require('./extract-type');

describe("extract-type transform", function() {

  var transform;

  beforeEach(function() {
    doc = {};
    tag = {};
    transform = transformFactory();
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

  it("should handle record types", function() {
    value = '{{x:number, y:number}} paramName - Some description';
    value = transform(doc, tag, value);
    expect(tag.typeList).toEqual(['{x:number, y:number}']);
  });
});