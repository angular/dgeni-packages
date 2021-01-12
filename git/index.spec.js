var gitPackage = require('./mocks/mockPackage');
var Dgeni = require('dgeni');
var mocks = require('./mocks/mocks');

describe('git package', () => {
  var extraData, dgeni;
  beforeEach(() => {
    dgeni = new Dgeni([gitPackage()]);
  });

  it("should be instance of Package", () => {
    expect(require('./') instanceof Dgeni.Package).toBeTruthy();
  });

  it("should have factories set", () => {
    var injector = dgeni.configureInjector();

    expect(injector.get('gitData')).toBeDefined();
    expect(injector.get('packageInfo')).toBeDefined();
    expect(injector.get('decorateVersion')).toBeDefined();
    expect(injector.get('versionInfo')).toBeDefined();
    expect(injector.get('gitRepoInfo')).toBeDefined();
  });

  it("should set extraData.git to gitData", () => {
    var injector = dgeni.configureInjector();
    var renderDocsProcessor = injector.get('renderDocsProcessor');
    expect(renderDocsProcessor.extraData.git).toBe(mocks.gitData);
  });
});
