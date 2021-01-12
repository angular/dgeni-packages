var transformFactory = require('./extract-type');

describe("extract-type transform", () => {

  var transform;

  beforeEach(() => {
    doc = {};
    tag = {};
    transform = transformFactory();
  });

  it("should extract the type from the description", () => {
    value = ' {string} paramName - Some description  \n Some more description';
    value = transform(doc, tag, value);

    expect(tag.typeList).toEqual(['string']);
    expect(value).toEqual('paramName - Some description  \n Some more description');
  });

  it("should return the description if no type is found", () => {
    value = 'paramName - Some description  \n Some more description';
    value = transform(doc, tag, value);
    expect(value).toEqual('paramName - Some description  \n Some more description');
  });

  it("should handle record types", () => {
    value = '{{x:number, y:number}} paramName - Some description';
    value = transform(doc, tag, value);
    expect(tag.typeList).toEqual(['{x:number, y:number}']);
  });

  it('should handle braces in the description', () => {
    value = 'paramName - Some description  \n Some `{ code: block }` in the description';
    value = transform(doc, tag, value);
    expect(value).toEqual('paramName - Some description  \n Some `{ code: block }` in the description');
  });
});