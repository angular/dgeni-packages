var processor = require('../../processors/tagExtractor');
var tagExtractorFactory = processor.exports.tagExtractor[1];
var TagCollection = require('../../lib/TagCollection');
var Tag = require('../../lib/Tag');

describe("tagExtractor helper", function() {
  it("should return a function that will extract the tags", function() {
    expect(tagExtractorFactory({}, [])).toEqual(jasmine.any(Function));
  });

  describe('default tag-def', function() {
    it("should the extract the description property to a property with the name of the tagDef", function() {
      var tagDef = { name: 'a' };
      var tagExtractor = tagExtractorFactory([tagDef]);

      var tag = new Tag(tagDef, 'a', 'some content', 123);
      var doc = {
        tags: new TagCollection([tag])
      };

      tagExtractor(doc);
      expect(doc.a).toEqual('some content');
    });
  });

  describe("tag-defs with docProperty", function() {
    it("should assign the extracted value to the docProperty", function() {
      var tagDef = { name: 'a', docProperty: 'b' };
      var tagExtractor = tagExtractorFactory([tagDef]);

      var tag = new Tag(tagDef, 'a', 'some content', 123);
      var doc = {
        tags: new TagCollection([tag])
      };

      tagExtractor(doc);
      expect(doc.a).toBeUndefined();
      expect(doc.b).toEqual('some content');

    });
  });

  describe("tag-defs with multi", function() {
    it("should assign the extracted value(s) to an array on the doc", function() {
      var tagDef = { name: 'a', multi: true };
      var tagExtractor = tagExtractorFactory([tagDef]);

      var tag1 = new Tag(tagDef, 'a', 'some content', 123);
      var tag2 = new Tag(tagDef, 'a', 'some other content', 256);
      var docA = {
        tags: new TagCollection([tag1])
      };
      var docB = {
        tags: new TagCollection([tag1, tag2])
      };

      tagExtractor(docA);
      expect(docA.a).toEqual(['some content']);

      tagExtractor(docB);
      expect(docB.a).toEqual(['some content', 'some other content']);
    });
  });

  describe("tag-defs with required", function() {
    it("should throw an error if the tag is missing", function() {
      var tagDef = { name: 'a', required: true };
      var tagExtractor = tagExtractorFactory([tagDef]);
      var doc = {
        tags: new TagCollection()
      };
      expect(function() { tagExtractor(doc); }).toThrow();
    });
  });

  describe("tag-defs with tagProperty", function() {
    it("should assign the specified tag property to the document", function() {

      var tagDef = { name: 'a', tagProperty: 'b' };
      var tagExtractor = tagExtractorFactory([tagDef]);

      var tag = new Tag(tagDef, 'a', 'some content', 123);
      tag.b = 'special value';
      var doc = {
        tags: new TagCollection([tag])
      };

      tagExtractor(doc);
      expect(doc.a).toEqual('special value');

    });
  });

  describe("tag-defs with defaultFn", function() {

    it("should run the defaultFn if the tag is missing", function() {
      var defaultFn = jasmine.createSpy('defaultFn').and.returnValue('default value');
      var tagDef = { name: 'a', defaultFn: defaultFn };
      var tagExtractor = tagExtractorFactory([tagDef]);
      var doc = {
        tags: new TagCollection()
      };
      tagExtractor(doc);
      expect(doc.a).toEqual('default value');
      expect(defaultFn).toHaveBeenCalled();
    });

    describe("and mult", function() {

      it("should run the defaultFn if the tag is missing", function() {
        var defaultFn = jasmine.createSpy('defaultFn').and.returnValue('default value');
        var tagDef = { name: 'a', defaultFn: defaultFn, multi: true };
        var tagExtractor = tagExtractorFactory([tagDef]);
        var doc = {
          tags: new TagCollection()
        };
        tagExtractor(doc);
        expect(doc.a).toEqual(['default value']);
        expect(defaultFn).toHaveBeenCalled();
      });

    });

  });


  describe("transforms", function() {

    describe("(single)", function() {
      it("should apply the transform to the extracted value", function() {
        function addA(doc, tag, value) { return value + '*A*'; }
        var tagDef = { name: 'a', transforms: addA };
        var tagExtractor = tagExtractorFactory([tagDef]);

        var tag = new Tag(tagDef, 'a', 'some content', 123);
        var doc = {
          tags: new TagCollection([tag])
        };

        tagExtractor(doc);
        expect(doc.a).toEqual('some content*A*');

      });

      it("should allow changes to tag and doc", function() {
        function transform(doc, tag, value) { doc.x = 'x'; tag.y = 'y'; return value; }
        var tagDef = { name: 'a', transforms: transform };
        var tagExtractor = tagExtractorFactory([tagDef]);

        var tag = new Tag(tagDef, 'a', 'some content', 123);
        var doc = {
          tags: new TagCollection([tag])
        };

        tagExtractor(doc);
        expect(doc.a).toEqual('some content');
        expect(doc.x).toEqual('x');
        expect(tag.y).toEqual('y');
      });
    });


    describe("(multiple)", function() {
      it("should apply the transforms to the extracted value", function() {
        function addA(doc, tag, value) { return value + '*A*'; }
        function addB(doc, tag, value) { return value + '*B*'; }
        var tagDef = { name: 'a', transforms: [ addA, addB ] };
        var tagExtractor = tagExtractorFactory([tagDef]);

        var tag = new Tag(tagDef, 'a', 'some content', 123);
        var doc = {
          tags: new TagCollection([tag])
        };

        tagExtractor(doc);
        expect(doc.a).toEqual('some content*A**B*');

      });

      it("should allow changes to tag and doc", function() {
        function transform1(doc, tag, value) { doc.x = 'x'; return value; }
        function transform2(doc, tag, value) { tag.y = 'y'; return value; }
        var tagDef = { name: 'a', transforms: [transform1, transform2] };
        var tagExtractor = tagExtractorFactory([tagDef]);

        var tag = new Tag(tagDef, 'a', 'some content', 123);
        var doc = {
          tags: new TagCollection([tag])
        };

        tagExtractor(doc);
        expect(doc.a).toEqual('some content');
        expect(doc.x).toEqual('x');
        expect(tag.y).toEqual('y');
      });
    });
  });

  describe("default transforms", function() {

    it("should apply the default transformations to all tags", function() {
      var tagDef1 = { name: 'a' };
      var tagDef2 = { name: 'b' };
      function addA(doc, tag, value) { return value + '*A*'; }
      var tagExtractor = tagExtractorFactory([tagDef1, tagDef2], [addA]);

      var tag1 = new Tag(tagDef1, 'a', 'some content', 123);
      var tag2 = new Tag(tagDef2, 'b', 'some other content', 123);
      var doc = {
        tags: new TagCollection([tag1, tag2])
      };

      tagExtractor(doc);
      expect(doc.a).toEqual('some content*A*');
      expect(doc.b).toEqual('some other content*A*');

    });


    it("should apply the default transformations after tag specific transforms", function() {
      function addA(doc, tag, value) { return value + '*A*'; }
      function addB(doc, tag, value) { return value + '*B*'; }
      var tagDef1 = { name: 'a', transforms: addA };
      var tagExtractor = tagExtractorFactory([tagDef1], [addB]);

      var tag1 = new Tag(tagDef1, 'a', 'some content', 123);
      var doc = {
        tags: new TagCollection([tag1])
      };

      tagExtractor(doc);
      expect(doc.a).toEqual('some content*A**B*');

    });
  });
});