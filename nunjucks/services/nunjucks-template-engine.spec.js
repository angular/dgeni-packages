const rewire = require('rewire');
var engineFactory = rewire('./nunjucks-template-engine');

describe("nunjucksTemplateEngine service", () => {
  let nunjucks, addFilterSpy, addExtensionSpy, engine, mockTemplateFinder;

  beforeEach(() => {

    nunjucks = engineFactory.__get__('nunjucks');

    nunjucks.Environment = jasmine.createSpy('Environment');
    nunjucks.Environment.prototype.addFilter = addFilterSpy = jasmine.createSpy('addFilter');
    nunjucks.Environment.prototype.addExtension = addExtensionSpy = jasmine.createSpy('addExtension');

    mockTemplateFinder = {
      templateFolders: 'templates'
    };
    engine = engineFactory(mockTemplateFinder);
  });

  describe("getRenderer()", () => {

    it("should configure nunjucks", () => {

      engine.templateFolders = ['templates'];
      engine.config = { foo: 'bar' };

      const render = engine.getRenderer();
      expect(render).toEqual(jasmine.any(Function));

      expect(nunjucks.Environment).toHaveBeenCalledWith(
        jasmine.any(nunjucks.FileSystemLoader),
        engine.config
      );
    });


    it("should load the given custom filters", () => {

      const dummyFilter = { name: 'test', process() {} };
      engine.filters.push(dummyFilter);

      const render = engine.getRenderer();
      expect(render).toEqual(jasmine.any(Function));

      expect(addFilterSpy).toHaveBeenCalledWith(dummyFilter.name, dummyFilter.process);
    });


    it("should load the given custom tags", () => {

      const dummyExtension = { tags: ['dummy']};
      engine.tags.push(dummyExtension);

      const render = engine.getRenderer();
      expect(render).toEqual(jasmine.any(Function));

      expect(addExtensionSpy).toHaveBeenCalledWith('dummy', dummyExtension);
    });
  });
});