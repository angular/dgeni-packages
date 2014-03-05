var rewire = require('rewire');
var plugin = rewire('../../processors/nunjucks-renderer');
var config = require('dgeni/lib/utils/config').Config;

describe("doc-renderer", function() {
  var nunjucks, addFilterSpy, addExtensionSpy, injectables;

  beforeEach(function() {
    injectables = jasmine.createSpyObj('injectables', ['value']);
    nunjucks = plugin.__get__('nunjucks');
    addFilterSpy = jasmine.createSpy('addFilter');
    addExtensionSpy = jasmine.createSpy('addExtension');

    nunjucks.Environment = jasmine.createSpy('Environment');
    nunjucks.Environment.prototype.addFilter = addFilterSpy;
    nunjucks.Environment.prototype.addExtension = addExtensionSpy;

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

    plugin.init(config, injectables);

    expect(nunjucks.Environment).toHaveBeenCalledWith(
      jasmine.any(nunjucks.FileSystemLoader), 
      nunjucksConfig
    );
  });

  it("should load the given custom filters and tags", function() {

    var dummyFilter = { name: 'test', process: function() {} }, dummyExtension = { tags: ['dummy']};

    config.set('rendering.filters', [dummyFilter]);
    config.set('rendering.tags', [dummyExtension]);

    plugin.init(config, injectables);

    expect(addFilterSpy).toHaveBeenCalledWith(dummyFilter.name, dummyFilter.process);
    expect(addExtensionSpy).toHaveBeenCalledWith('dummy', dummyExtension);
  });
});
