var mockPackage = require('../mocks/mockPackage');
var Dgeni = require('dgeni');

describe("inlineTagsProcessor", function() {

  var processor, mockLog;

  beforeEach(function() {
    var dgeni = new Dgeni([mockPackage()]);
    var injector = dgeni.configureInjector();

    processor = injector.get('inlineTagProcessor');
    mockLog = injector.get('log');
  });


  it("should run after docs are rendered and before writing files", function() {
    expect(processor.$runAfter).toEqual(['docs-rendered']);
    expect(processor.$runBefore).toEqual(['writing-files']);
  });


  describe("$process", function() {

    it("should parse the inline tags from the renderedContent", function() {

      // The processor is mostly only interested in the renderedContent but the other fields are
      // used in error reporting
      var doc = {
        file: 'a/b/c.js',
        startingLine: 123,
        renderedContent:
          'abc def\n' +
          'xyz {@unhandledTag some description} fgh\n' +
          '{@handledTag other description}\n' +
          'text {@handledTag more\ndescription }'
      };
      var docs = [doc];

      // Provide a mock tag handler to track what tags have been handled
      var tagsFound = [];
      var mockInlineTagDefinition = {
        name: 'handledTag',
        handler: function(doc, tagName, tagDescription, docs) {
          tagsFound.push({ name: tagName, description: tagDescription });
          return '<Tag Handled>';
        }
      };

      processor.inlineTagDefinitions = [mockInlineTagDefinition];

      // Run the processor
      var results = processor.$process(docs);

      // This processor should not return anything.  All its work is done on the docs, in place
      expect(results).toBeUndefined();

      // We expect the unhandled tag to be reported
      expect(mockLog.warn).toHaveBeenCalled();
      expect(mockLog.warn.calls.argsFor(0)[0]).toContain('No handler provided for inline tag "{@unhandledTag some description}"');

      // We expect the handler to have been invoked for the handledTag
      expect(tagsFound).toEqual([
        { name: 'handledTag', description: 'other description' },
        { name: 'handledTag', description: 'more\ndescription' }
      ]);

      // We expect the unhandled tag to habe been left alone and the handled tag to have been replaced
      expect(doc.renderedContent).toEqual(
        'abc def\n' +
        'xyz {@unhandledTag some description} fgh\n' +
        '<Tag Handled>\n' +
        'text <Tag Handled>'
      );
    });

    it("should parse the block of rendered content between start and end inline tags", function() {
      var doc = {
        file: 'a/b/c.js',
        startingLine: 123,
        renderedContent:
          'content before ' +
          '{@block param1 param2}' +
          'content within the inline tag' +
          '{@endblock} ' +
          'content after'
      };
      var docs = [doc];

      // Provide a mock tag handler to track what tags have been handled
      var tagsFound = [];
      var mockInlineTagDefinition = {
        name: 'block',
        end: 'endblock',
        handler: function(doc, tagName, tagDescription, docs) {
          tagsFound.push({ name: tagName, description: tagDescription });
          return '<Tag Handled>';
        }
      };

      processor.inlineTagDefinitions = [mockInlineTagDefinition];

      // Run the processor
      var results = processor.$process(docs);

      // This processor should not return anything.  All its work is done on the docs, in place
      expect(results).toBeUndefined();


      // We expect the handler to have been invoked for the block tag
      expect(tagsFound).toEqual([
        {
          name: 'block',
          description: {
            tag: 'param1 param2',
            content: 'content within the inline tag'
          }
        }
      ]);

      expect(doc.renderedContent).toEqual('content before <Tag Handled> content after');
    });

    it("should not get confused by successive inline tags", function() {
      var doc = {
        file: 'a/b/c.js',
        startingLine: 123,
        renderedContent:
          '{@block param1 param2}' +
          'content within the inline tag' +
          '{@endblock} ' +
          '{@block param3 param4}' +
          'more content within another inline tag' +
          '{@endblock}'
      };
      var docs = [doc];

      // Provide a mock tag handler to track what tags have been handled
      var tagsFound = [];
      var mockInlineTagDefinition = {
        name: 'block',
        end: 'endblock',
        handler: function(doc, tagName, tagDescription, docs) {
          tagsFound.push({ name: tagName, description: tagDescription });
          return '<Tag Handled>';
        }
      };

      processor.inlineTagDefinitions = [mockInlineTagDefinition];

      // Run the processor
      var results = processor.$process(docs);

      // This processor should not return anything.  All its work is done on the docs, in place
      expect(results).toBeUndefined();


      // We expect the handler to have been invoked for the block tag
      expect(tagsFound).toEqual([
        {
          name: 'block',
          description: {
            tag: 'param1 param2',
            content: 'content within the inline tag'
          }
        },
        {
          name: 'block',
          description: {
            tag: 'param3 param4',
            content: 'more content within another inline tag'
          }
        }
      ]);

      expect(doc.renderedContent).toEqual('<Tag Handled> <Tag Handled>');
    });
  });

});

