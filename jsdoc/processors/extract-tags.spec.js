const mockPackage = require('../mocks/mockPackage');
const Dgeni = require('dgeni');

const Tag = require('../lib/Tag');
const TagCollection = require('../lib/TagCollection');


function createDoc(tags) {
  return {
    fileInfo: {
      filePath: 'some/file.js'
    },
    tags: new TagCollection(tags)
  };
}

describe("extractTagsProcessor", () => {

  let parseTagsProcessor, processor, mockLog;

  beforeEach(() => {
    const dgeni = new Dgeni([mockPackage()]);
    const injector = dgeni.configureInjector();
    parseTagsProcessor = injector.get('parseTagsProcessor');
    processor = injector.get('extractTagsProcessor');
    mockLog = injector.get('log');
  });

  it("should log a warning if the doc contains bad tags", () => {

      const doc = createDoc([]);
      doc.tags.badTags = [ {
        name: 'bad1',
        description: 'bad tag 1',
        typeExpression: 'string',
        errors: [
          'first bad thing',
          'second bad thing'
        ]
      }];

      processor.$process([doc]);
      expect(mockLog.warn).toHaveBeenCalledWith('Invalid tags found - doc\n' +
        'Line: undefined: @undefined {string} bad1 bad tag 1...\n' +
        '    * first bad thing\n' +
        '    * second bad thing\n\n');
  });

  describe('default tag-def', () => {
    it("should the extract the description property to a property with the name of the tagDef", () => {
      const tagDef = { name: 'a' };
      parseTagsProcessor.tagDefinitions = [tagDef];

      const tag = new Tag(tagDef, 'a', 'some content', 123);
      const doc = createDoc([tag]);

      processor.$process([doc]);
      expect(doc.a).toEqual('some content');
    });

    it("should not write a property to the doc if the tag value is undefined", () => {
      const tagDef = { name: 'a' };
      parseTagsProcessor.tagDefinitions = [tagDef];

      const tag = new Tag(tagDef, 'a', undefined, 123);
      const doc = createDoc([tag]);

      processor.$process([doc]);
      expect(doc.a).toBeUndefined();
      expect(Object.keys(doc)).not.toContain('a');
    });
  });

  describe("tag-defs with docProperty", () => {
    it("should assign the extracted value to the docProperty", () => {
      const tagDef = { name: 'a', docProperty: 'b' };
      parseTagsProcessor.tagDefinitions = [tagDef];

      const tag = new Tag(tagDef, 'a', 'some content', 123);
      const doc = createDoc([tag]);

      processor.$process([doc]);
      expect(doc.a).toBeUndefined();
      expect(doc.b).toEqual('some content');

    });

    it("should not write a property to the doc if the tag value is undefined", () => {
      const tagDef = { name: 'a', docProperty: 'b' };
      parseTagsProcessor.tagDefinitions = [tagDef];

      const tag = new Tag(tagDef, 'a', undefined, 123);
      const doc = createDoc([tag]);

      processor.$process([doc]);
      expect(doc.b).toBeUndefined();
      expect(Object.keys(doc)).not.toContain('b');
    });
  });

  describe("tag-defs with multi", () => {
    it("should assign the extracted value(s) to an array on the doc", () => {
      const tagDef = { name: 'a', multi: true };
      parseTagsProcessor.tagDefinitions = [tagDef];

      const tag1 = new Tag(tagDef, 'a', 'some content', 123);
      const tag2 = new Tag(tagDef, 'a', 'some other content', 256);
      const docA = createDoc([tag1]);
      const docB = createDoc([tag1, tag2]);

      processor.$process([docA]);
      expect(docA.a).toEqual(['some content']);

      processor.$process([docB]);
      expect(docB.a).toEqual(['some content', 'some other content']);
    });

    it("should not add a value to the array if the tag value is undefined", () => {
      const tagDef = { name: 'a', multi: true };
      parseTagsProcessor.tagDefinitions = [tagDef];

      const tag1 = new Tag(tagDef, 'a', undefined, 123);
      const tag2 = new Tag(tagDef, 'a', 'some other content', 256);
      const docA = createDoc([tag1]);
      const docB = createDoc([tag1, tag2]);

      processor.$process([docA]);
      expect(docA.a).toEqual([]);

      processor.$process([docB]);
      expect(docB.a).toEqual(['some other content']);
    });
  });

  describe("tag-defs with required", () => {
    it("should throw an error if the tag is missing", () => {
      const tagDef = { name: 'a', required: true };
      parseTagsProcessor.tagDefinitions = [tagDef];

      const doc = createDoc([]);
      expect(() => processor.$process([doc])).toThrow();
    });
  });

  describe("tag-defs with tagProperty", () => {
    it("should assign the specified tag property to the document", () => {

      const tagDef = { name: 'a', tagProperty: 'b' };
      parseTagsProcessor.tagDefinitions = [tagDef];

      const tag = new Tag(tagDef, 'a', 'some content', 123);
      tag.b = 'special value';
      const doc = createDoc([tag]);

      processor.$process([doc]);
      expect(doc.a).toEqual('special value');

    });

    it("should not write a property to the doc if the specified tag value is undefined", () => {
      const tagDef = { name: 'a', tagProperty: 'b' };
      parseTagsProcessor.tagDefinitions = [tagDef];

      const tag = new Tag(tagDef, 'a', 'some content', 123);
      tag.b = undefined;
      const doc = createDoc([tag]);

      processor.$process([doc]);
      expect(doc.a).toBeUndefined();
      expect(Object.keys(doc)).not.toContain('a');
    });
  });

  describe("tag-defs with defaultFn", () => {

    it("should run the defaultFn if the tag is missing", () => {
      const defaultFn = jasmine.createSpy('defaultFn').and.returnValue('default value');
      const tagDef = { name: 'a', defaultFn: defaultFn };
      parseTagsProcessor.tagDefinitions = [tagDef];

      const doc = createDoc([]);

      processor.$process([doc]);
      expect(doc.a).toEqual('default value');
      expect(defaultFn).toHaveBeenCalled();
    });


    it("should not write a property to the doc if the defaultFn returns undefined", () => {
      const tagDef = { name: 'a', defaultFn() {} };
      parseTagsProcessor.tagDefinitions = [tagDef];

      const doc = createDoc([]);

      processor.$process([doc]);
      expect(doc.a).toBeUndefined();
      expect(Object.keys(doc)).not.toContain('a');
    });

    describe("and mult", () => {

      it("should run the defaultFn if the tag is missing", () => {
        const defaultFn = jasmine.createSpy('defaultFn').and.returnValue('default value');
        const tagDef = { name: 'a', defaultFn: defaultFn, multi: true };

        parseTagsProcessor.tagDefinitions = [tagDef];
        const doc = createDoc([]);

        processor.$process([doc]);
        expect(doc.a).toEqual(['default value']);
        expect(defaultFn).toHaveBeenCalled();
      });

      it("should not add a value to the array if the defaultFn returns undefined", () => {
        const tagDef = { name: 'a', defaultFn() {}, multi: true };

        parseTagsProcessor.tagDefinitions = [tagDef];
        const doc = createDoc([]);

        processor.$process([doc]);
        expect(doc.a).toEqual([]);
      });
    });

  });


  describe("transforms", () => {

    describe("(single)", () => {
      it("should apply the transform to the extracted value", () => {
        function addA(doc, tag, value) { return value + '*A*'; }
        const tagDef = { name: 'a', transforms: addA };

        parseTagsProcessor.tagDefinitions = [tagDef];

        const tag = new Tag(tagDef, 'a', 'some content', 123);
        const doc = createDoc([tag]);

        processor.$process([doc]);
        expect(doc.a).toEqual('some content*A*');

      });

      it("should not write to the property if the transform returns undefined", () => {
        function returnUndefined(doc, tag, value) {}

        const tagDef = { name: 'a', transforms: returnUndefined };

        parseTagsProcessor.tagDefinitions = [tagDef];

        const tag = new Tag(tagDef, 'a', 'some content', 123);
        const doc = createDoc([tag]);

        processor.$process([doc]);
        expect(doc.a).toBeUndefined();
        expect(Object.keys(doc)).not.toContain('a');

      });

      it("should allow changes to tag and doc", () => {
        function transform(doc, tag, value) { doc.x = 'x'; tag.y = 'y'; return value; }
        const tagDef = { name: 'a', transforms: transform };

        parseTagsProcessor.tagDefinitions = [tagDef];

        const tag = new Tag(tagDef, 'a', 'some content', 123);
        const doc = createDoc([tag]);

        processor.$process([doc]);
        expect(doc.a).toEqual('some content');
        expect(doc.x).toEqual('x');
        expect(tag.y).toEqual('y');
      });
    });


    describe("(multiple)", () => {
      it("should apply the transforms to the extracted value", () => {
        function addA(doc, tag, value) { return value + '*A*'; }
        function addB(doc, tag, value) { return value + '*B*'; }
        const tagDef = { name: 'a', transforms: [ addA, addB ] };

        parseTagsProcessor.tagDefinitions = [tagDef];

        const tag = new Tag(tagDef, 'a', 'some content', 123);
        const doc = createDoc([tag]);

        processor.$process([doc]);
        expect(doc.a).toEqual('some content*A**B*');

      });

      it("should not write to the property if the final transform returns undefined", () => {
        function addA(doc, tag, value) { return value + '*A*'; }
        function returnUndefined(doc, tag, value) {}

        const tagDef = { name: 'a', transforms: [addA, returnUndefined] };

        parseTagsProcessor.tagDefinitions = [tagDef];

        const tag = new Tag(tagDef, 'a', 'some content', 123);
        const doc = createDoc([tag]);

        processor.$process([doc]);
        expect(doc.a).toBeUndefined();
        expect(Object.keys(doc)).not.toContain('a');

      });


      it("should write to the property if transform returns undefined as long as the final transform returns a defined value", () => {
        function addA(doc, tag, value) { return value + '*A*'; }
        function returnUndefined(doc, tag, value) {}

        const tagDef = { name: 'a', transforms: [returnUndefined, addA] };

        parseTagsProcessor.tagDefinitions = [tagDef];

        const tag = new Tag(tagDef, 'a', 'some content', 123);
        const doc = createDoc([tag]);

        processor.$process([doc]);
        expect(doc.a).toEqual('undefined*A*');

      });

      it("should allow changes to tag and doc", () => {
        function transform1(doc, tag, value) { doc.x = 'x'; return value; }
        function transform2(doc, tag, value) { tag.y = 'y'; return value; }
        const tagDef = { name: 'a', transforms: [transform1, transform2] };

        parseTagsProcessor.tagDefinitions = [tagDef];

        const tag = new Tag(tagDef, 'a', 'some content', 123);
        const doc = createDoc([tag]);

        processor.$process([doc]);
        expect(doc.a).toEqual('some content');
        expect(doc.x).toEqual('x');
        expect(tag.y).toEqual('y');
      });
    });
  });

  describe("default transforms", () => {

    it("should apply the default transformations to all tags", () => {
      const tagDef1 = { name: 'a' };
      const tagDef2 = { name: 'b' };
      function addA(doc, tag, value) { return value + '*A*'; }

      parseTagsProcessor.tagDefinitions = [tagDef1, tagDef2];
      processor.defaultTagTransforms = [addA];

      const tag1 = new Tag(tagDef1, 'a', 'some content', 123);
      const tag2 = new Tag(tagDef2, 'b', 'some other content', 123);
      const doc = createDoc([tag1, tag2]);

      processor.$process([doc]);
      expect(doc.a).toEqual('some content*A*');
      expect(doc.b).toEqual('some other content*A*');

    });


    it("should apply the default transformations after tag specific transforms", () => {
      function addA(doc, tag, value) { return value + '*A*'; }
      function addB(doc, tag, value) { return value + '*B*'; }
      const tagDef1 = { name: 'a', transforms: addA };

      parseTagsProcessor.tagDefinitions = [tagDef1];
      processor.defaultTagTransforms = [addB];

      const tag = new Tag(tagDef1, 'a', 'some content', 123);
      const doc = createDoc([tag]);

      processor.$process([doc]);
      expect(doc.a).toEqual('some content*A**B*');

    });
  });

});