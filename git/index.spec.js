var gitPackage = require('./mocks/mockPackage');
var Dgeni = require('dgeni');
var mocks = require('./mocks/mocks');

describe('git package', function() {
  var extraData, dgeni;
  beforeEach(function() {
    dgeni = new Dgeni([gitPackage()]);
  });

  it("should be instance of Package", function() {
    expect(require('./') instanceof Dgeni.Package).toBeTruthy();
  });

  it("should have factories set", function() {
    var injector = dgeni.configureInjector();

    expect(injector.get('gitData')).toBeDefined();
    expect(injector.get('packageInfo')).toBeDefined();
    expect(injector.get('decorateVersion')).toBeDefined();
    expect(injector.get('versionInfo')).toBeDefined();
    expect(injector.get('gitRepoInfo')).toBeDefined();
  });

  it("should set extraData.git to gitData", function() {
    var injector = dgeni.configureInjector();
    var renderDocsProcessor = injector.get('renderDocsProcessor');
    expect(renderDocsProcessor.extraData.git).toBe(mocks.gitData);
  });
});
