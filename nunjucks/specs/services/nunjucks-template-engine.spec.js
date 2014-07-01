var rewire = require('rewire');
var engineFactory = rewire('../../services/nunjucks-template-engine');

describe("nunjucksTemplateEngine service", function() {
  var nunjucks, addFilterSpy, addExtensionSpy, templateFolders, nunjucksConfig, nunjucksFilters, nunjucksTags;

  beforeEach(function() {

    nunjucks = engineFactory.__get__('nunjucks');
    addFilterSpy = jasmine.createSpy('addFilter');
    addExtensionSpy = jasmine.createSpy('addExtension');

    nunjucks.Environment = jasmine.createSpy('Environment');
    nunjucks.Environment.prototype.addFilter = addFilterSpy;
    nunjucks.Environment.prototype.addExtension = addExtensionSpy;


    templateFolders = ['templates'];
    nunjucksConfig = {};
    nunjucksFilters = [];
    nunjucksTags = [];
  });

  it("should have a return an instance of Environment", function() {
    var engine = engineFactory(templateFolders, nunjucksConfig, nunjucksFilters, nunjucksTags);
    expect(engine instanceof nunjucks.Environment).toBeTruthy();
  });

  it("should configure nunjucks", function() {

    nunjucksConfig = { foo: 'bar' };

    engineFactory(templateFolders, nunjucksConfig, nunjucksFilters, nunjucksTags);

    expect(nunjucks.Environment).toHaveBeenCalledWith(
      jasmine.any(nunjucks.FileSystemLoader),
      nunjucksConfig
    );
  });

  it("should load the given custom filters and tags", function() {

    var dummyFilter = { name: 'test', process: function() {} }, dummyExtension = { tags: ['dummy']};

    nunjucksFilters = [dummyFilter];
    nunjucksTags = [dummyExtension];

    engineFactory(templateFolders, nunjucksConfig, nunjucksFilters, nunjucksTags);

    expect(addFilterSpy).toHaveBeenCalledWith(dummyFilter.name, dummyFilter.process);
    expect(addExtensionSpy).toHaveBeenCalledWith('dummy', dummyExtension);
  });
});
