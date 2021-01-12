var tagDefFactory = require('./description');

describe("description tag-def", () => {
  var tagDef;

  beforeEach(() => {
    tagDef = tagDefFactory();
  });

  describe('transforms', () => {
    it("should prepend any non-tag specific description found in the jsdoc comment", () => {
      var doc = { tags: { description: 'general description'} };
      var tag = {};
      var value = "tag specific description";
      expect(tagDef.transforms(doc, tag, value)).toEqual('general description\ntag specific description');
    });
  });


  describe("defaultFn", () => {
    it("should get the contents of the non-tag specific description", () => {
      var doc = { tags: { description: 'general description'} };
      expect(tagDef.defaultFn(doc)).toEqual('general description');
    });
  });
});