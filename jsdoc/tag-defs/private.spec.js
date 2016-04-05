var tagDefFactory = require('./private');

describe("private tagDef", function() {
  it("should have correct name and property", function() {
    var tagDef = tagDefFactory();

    expect(tagDef.name).toEqual('private');
  });

  it("should set value to true unless the tag has a value", function () {
    var tagDef = tagDefFactory();

    expect(tagDef.transforms({}, {}, '')).toBe(true);
    expect(tagDef.transforms({}, {}, 'some description')).toBe('some description');
  });
});