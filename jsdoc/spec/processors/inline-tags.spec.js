var config = require('dgeni/lib/utils/config').Config;
var processor = require('../../processors/inline-tags');
var di = require('di');
var log = require('winston');

describe("inline-tags processor", function() {
  
  it("should be called 'inline-tags'", function() {
    expect(processor.name).toEqual('inline-tags');
  });
  

  it("should run after docs are rendered and before writing files", function() {
    expect(processor.runAfter).toEqual(['docs-rendered']);
    expect(processor.runBefore).toEqual(['writing-files']);
  });


  describe("process", function() {

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

      var tagsFound = [];
      var mockInlineTagDefinition = {
        name: 'handledTag',
        handlerFactory: function(docs) {
          return function(doc, tagName, tagDescription) {
            tagsFound.push({ name: tagName, description: tagDescription });
            return '<Tag Handled>';
          };
        }
      };

      // We spy on log.warn since this will be called on each missing handler
      spyOn(log, 'warn');

      // Create the injector that the processor will use
      var injector = new di.Injector([ { docs: ['value', docs] } ]);

      // Provide a mock inline tag handler
      config.set('processing.inlineTagDefinitions', [mockInlineTagDefinition]);

      // Run the processor
      processor.init(config);
      var results = processor.process(docs, injector);

      // This processor should not return anything.  All its work is done on the docs, in place
      expect(results).toBeUndefined();
      
      // We expect the unhandled tag to be reported
      expect(log.warn).toHaveBeenCalled();
      expect(log.warn.calls[0].args[0]).toMatch(/No handler provided for inline tag "\{@unhandledTag some description\}"/);

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

