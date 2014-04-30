var rewire = require('rewire');
var processor = rewire('../nunjucks-template-engine');
var engineFactory = processor.exports.templateEngine[1];
var Config = require('dgeni').Config;

describe("nunjucks-template-engine Helper", function() {
  var nunjucks, addFilterSpy, addExtensionSpy, injectables, config;

  beforeEach(function() {
    injectables = jasmine.createSpyObj('injectables', ['value']);
    nunjucks = processor.__get__('nunjucks');
    addFilterSpy = jasmine.createSpy('addFilter');
    addExtensionSpy = jasmine.createSpy('addExtension');

    nunjucks.Environment = jasmine.createSpy('Environment');
    nunjucks.Environment.prototype.addFilter = addFilterSpy;
    nunjucks.Environment.prototype.addExtension = addExtensionSpy;

    config = new Config();
    config.set('basePath', '/');
    config.set('rendering', {
      templateFolders: ['templates'],
      templatePatterns: [],
      outputFolder: 'output'
    });
  });

  it("should configure nunjucks", function() {

    var nunjucksConfig = { foo: 'bar' };
    config.set('rendering.nunjucks.config', nunjucksConfig);

    engineFactory(config);

    expect(nunjucks.Environment).toHaveBeenCalledWith(
      jasmine.any(nunjucks.FileSystemLoader),
      nunjucksConfig
    );
  });

  it("should load the given custom filters and tags", function() {

    var dummyFilter = { name: 'test', process: function() {} }, dummyExtension = { tags: ['dummy']};

    config.set('rendering.filters', [dummyFilter]);
    config.set('rendering.tags', [dummyExtension]);

    engineFactory(config);

    expect(addFilterSpy).toHaveBeenCalledWith(dummyFilter.name, dummyFilter.process);
    expect(addExtensionSpy).toHaveBeenCalledWith('dummy', dummyExtension);
  });
});
