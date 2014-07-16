var factory = require('../../processors/inline-tags');
var mockLog = require('dgeni/lib/mocks/log')();

function createProcessor() {
  var mockGetInjectables = jasmine.createSpy().and.callFake(function(objects) { return objects; });
  return factory(mockLog, mockGetInjectables);
}

describe("inline-tags processor", function() {

  it("should have the correct name", function() {
    expect(factory.name).toEqual('inlineTagProcessor');
  });


  it("should run after docs are rendered and before writing files", function() {
    var processor = createProcessor();
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
          '{@handledTag other description}'
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

      var processor = createProcessor();
      processor.inlineTagDefinitions = [mockInlineTagDefinition];

      // Run the processor
      var results = processor.$process(docs);

      // This processor should not return anything.  All its work is done on the docs, in place
      expect(results).toBeUndefined();

      // We expect the unhandled tag to be reported
      expect(mockLog.warn).toHaveBeenCalled();
      expect(mockLog.warn.calls.argsFor(0)[0]).toMatch(/No handler provided for inline tag "\{@unhandledTag some description\}"/);

      // We expect the handler to have been invoked for the handledTag
      expect(tagsFound).toEqual([
        { name: 'handledTag', description: 'other description' }
      ]);

      // We expect the unhandled tag to habe been left alone and the handled tag to have been replaced
      expect(doc.renderedContent).toEqual(
        'abc def\n' +
        'xyz {@unhandledTag some description} fgh\n' +
        '<Tag Handled>'
      );
    });
  });

});

