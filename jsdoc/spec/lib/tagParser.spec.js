var tagParserFactory = require('../../lib/tagParser');

describe("tagParser", function() {
  describe("tagParserFactory", function() {
    it("should accept a set of tag-definitions and return a configured tagParser", function() {
      var tagDefinitions = [];
      var tagParser = tagParserFactory(tagDefinitions);
      expect(tagParser).toEqual(jasmine.any(Function));
    });
  });

  describe("tagParser", function() {
    it("should only return tags that are not ignored", function() {
      var tagDefinitions = [
        { name: 'id' },
        { name: 'description' },
        { name: 'param' },
        { name: 'other-tag', ignore: true }
      ];
      var tagParser = tagParserFactory(tagDefinitions);
      var content = 'Some initial content\n@id some.id\n' +
                    '@description Some description\n@other-tag Some other tag\n' +
                    '@param some param\n@param some other param';
      var tags = tagParser(content, 10);

      expect(tags.tags[0]).toEqual(
        jasmine.objectContaining({ tagName: 'id', description: 'some.id', startingLine: 11 })
      );
        // Not that the description tag contains what appears to be another tag but it was ignored so
        // is consumed into the description tag!
      expect(tags.tags[1]).toEqual(
        jasmine.objectContaining({ tagName: 'description', description: 'Some description\n@other-tag Some other tag', startingLine: 12})
      );
      expect(tags.tags[2]).toEqual(
        jasmine.objectContaining({ tagName: 'param', description: 'some param', startingLine: 14 })
      );
      expect(tags.tags[3]).toEqual(
        jasmine.objectContaining({ tagName: 'param', description: 'some other param', startingLine: 15 })
      );
    });

    it("should cope with tags that have no description", function() {
      var tagDefinitions = [
        { name: 'id' },
        { name: 'description' },
        { name: 'param' }
      ];
      var tagParser = tagParserFactory(tagDefinitions);
      var content = '@id\n@description some description';
      var tags = tagParser(content, 123);
      expect(tags.tags[0]).toEqual(jasmine.objectContaining({ tagName: 'id', description: '' }));
      expect(tags.tags[1]).toEqual(jasmine.objectContaining({ tagName: 'description', description: 'some description' }));
    });

    it("should cope with empty content or no known tags", function() {
      var tagParser = tagParserFactory([]);
      expect(function() {
        tagParser('', 123);
      }).not.toThrow();

      expect(function() {
        tagParser('@unknownTag some text', 123);
      }).not.toThrow();
    });


    it("should ignore @tags inside back-ticked code blocks", function() {
      var tagParser = tagParserFactory([ { name: 'a' }, { name: 'b' }]);
      var tags = tagParser(
        '@a some text\n\n' +
        '```\n' +
        '  some code\n' +
        '  @b not a tag\n' +
        '```\n\n' +
        'more text\n' +
        '@b is a tag'
      );
      expect(tags.getTag('a').description).toEqual('some text\n\n' +
        '```\n' +
        '  some code\n' +
        '  @b not a tag\n' +
        '```\n\n' +
        'more text'
      );
      expect(tags.getTags('b').length).toEqual(1);
      expect(tags.getTag('b').description).toEqual('is a tag');
    });
  });
});