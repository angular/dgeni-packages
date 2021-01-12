const gitPackage = require('./mocks/mockPackage');
const Dgeni = require('dgeni');
const mocks = require('./mocks/mocks');

describe('git package', () => {
  let extraData, dgeni;
  beforeEach(() => {
    dgeni = new Dgeni([gitPackage()]);
  });

  it("should be instance of Package", () => {
    expect(require('./') instanceof Dgeni.Package).toBeTruthy();
  });

  it("should have factories set", () => {
    const injector = dgeni.configureInjector();

    expect(injector.get('gitData')).toBeDefined();
    expect(injector.get('packageInfo')).toBeDefined();
    expect(injector.get('decorateVersion')).toBeDefined();
    expect(injector.get('versionInfo')).toBeDefined();
    expect(injector.get('gitRepoInfo')).toBeDefined();
  });

  it("should set extraData.git to gitData", () => {
    const injector = dgeni.configureInjector();
    const renderDocsProcessor = injector.get('renderDocsProcessor');
    expect(renderDocsProcessor.extraData.git).toBe(mocks.gitData);
  });
});
