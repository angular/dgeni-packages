const tagDefFactory = require('./description');

describe("description tag-def", () => {
  let tagDef;

  beforeEach(() => {
    tagDef = tagDefFactory();
  });

  describe('transforms', () => {
    it("should prepend any non-tag specific description found in the jsdoc comment", () => {
      const doc = { tags: { description: 'general description'} };
      const tag = {};
      const value = "tag specific description";
      expect(tagDef.transforms(doc, tag, value)).toEqual('general description\ntag specific description');
    });
  });


  describe("defaultFn", () => {
    it("should get the contents of the non-tag specific description", () => {
      const doc = { tags: { description: 'general description'} };
      expect(tagDef.defaultFn(doc)).toEqual('general description');
    });
  });
});