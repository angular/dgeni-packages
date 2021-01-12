const transformFactory = require('./extract-type');

describe("extract-type transform", () => {

  let transform, doc, tag;

  beforeEach(() => {
    doc = {};
    tag = {};
    transform = transformFactory();
  });

  it("should extract the type from the description", () => {
    let value = ' {string} paramName - Some description  \n Some more description';
    value = transform(doc, tag, value);

    expect(tag.typeList).toEqual(['string']);
    expect(value).toEqual('paramName - Some description  \n Some more description');
  });

  it("should return the description if no type is found", () => {
    let value = 'paramName - Some description  \n Some more description';
    value = transform(doc, tag, value);
    expect(value).toEqual('paramName - Some description  \n Some more description');
  });

  it("should handle record types", () => {
    let value = '{{x:number, y:number}} paramName - Some description';
    value = transform(doc, tag, value);
    expect(tag.typeList).toEqual(['{x:number, y:number}']);
  });

  it('should handle braces in the description', () => {
    let value = 'paramName - Some description  \n Some `{ code: block }` in the description';
    value = transform(doc, tag, value);
    expect(value).toEqual('paramName - Some description  \n Some `{ code: block }` in the description');
  });
});