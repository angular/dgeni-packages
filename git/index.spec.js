var gitPackage = require('./');
var Dgeni = require('dgeni');
var mocks = require('./mocks/mocks.js');

describe('git package', function() {
  var extraData, dgeni;
  beforeEach(function() {
    extraData = {};

    gitPackage
    .factory(function gitData() { return mocks.gitData })
    .factory('renderDocsProcessor', function dummyRenderDocsProcessor() {
      return {
        extraData: extraData
      };
    });

    dgeni = new Dgeni([gitPackage]);
  });

  it("should be instance of Package", function() {
    expect(gitPackage instanceof Dgeni.Package).toBeTruthy();
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
    dgeni.generate();

    expect(extraData.git).toBe(mocks.gitData);
  });
});
