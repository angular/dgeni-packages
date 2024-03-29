const TagCollection = require('./TagCollection');
const Tag = require('./Tag');

describe("TagCollection", () => {
  let tags;

  beforeEach(() => {
    tags = new TagCollection();
  });

  it("should set up the object properties", () => {
    expect(tags.tags).toEqual([]);
    expect(tags.badTags).toEqual([]);
    // We clone so that toEqual works with our "bare" object
    expect(tags.tagsByName.size).toEqual(0);
    expect(tags.description).toEqual('');
  });

  it("should add the tags provided to the constructor", () => {
    spyOn(TagCollection.prototype, 'addTag');
    new TagCollection([{}, {}, {}]);
    expect(TagCollection.prototype.addTag).toHaveBeenCalled();
    expect(TagCollection.prototype.addTag.calls.count()).toEqual(3);
  });

  describe("addTag", () => {
    it("should add a good tag to the tags and tagsByName properties", () => {
      const goodTag = { tagDef: { name: 'param'} };
      tags.addTag(goodTag);
      expect(tags.tags[0]).toBe(goodTag);
      expect(tags.tagsByName.get('param')[0]).toBe(goodTag);
      expect(tags.badTags).toEqual([]);
    });

    it("should add a bad tag to the badTags properties", () => {
      const badTag = { tagDef: { name: 'param'}, errors: [ {} ] };
      tags.addTag(badTag);
      expect(tags.badTags[0]).toBe(badTag);
      expect(tags.tags).toEqual([]);
      expect(tags.tagsByName.get('param')).toBeUndefined();
    });
  });

  describe("removeTag", () => {
    it("should remove the tag from both the tags and the tagsByName", () => {
      const tag = { tagDef: { name: 'param' } };
      tags.addTag(tag);
      tags.removeTag(tag);
      expect(tags.tags).toEqual([]);
      expect(tags.tagsByName.get('param')).toEqual([]);
    });
  });

  describe("getTag", () => {
    it("should get the first tag that matches the tagDef", () => {
      const tagDef = { name: 'param' };
      const tag1 = new Tag(tagDef, 'param', '...', 0);
      const tag2 = new Tag(tagDef, 'param', '...', 100);
      tags.addTag(tag1);
      tags.addTag(tag2);
      expect(tags.getTag(tagDef.name)).toBe(tag1);
    });
  });

  describe("getTags", () => {
    it("should get the tags by name", () => {
      const tagDef = { name: 'param' };
      const tag1 = new Tag(tagDef, 'param', '...', 0);
      const tag2 = new Tag(tagDef, 'param', '...', 100);
      tags.addTag(tag1);
      tags.addTag(tag2);
      expect(tags.getTags(tagDef.name)).toEqual([tag1,tag2]);
    });
  });

});