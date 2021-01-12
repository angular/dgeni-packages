var mockPackageFactory = require('../mocks/mockPackage');
var Dgeni = require('dgeni');
var gitRepoInfoFactory = require('./gitRepoInfo');

describe("gitRepoInfo", () => {
  var gitRepoInfo, mockPackage;

  beforeEach(() => {
    mockPackage = mockPackageFactory()
      .factory(gitRepoInfoFactory);

    var dgeni = new Dgeni([mockPackage]);

    var injector = dgeni.configureInjector();
    gitRepoInfo = injector.get('gitRepoInfo');
  });

  it("should be set", () => {
    expect(gitRepoInfo).not.toBe(null);
  });

  it("should have owner set from package repository url", () => {
    expect(gitRepoInfo.owner).toBe('owner');
  });

  it("should have repo set from package repository url", () => {
    expect(gitRepoInfo.repo).toBe('repo');
  });

  it("should throw an error if packageInfo is empty", () => {
    mockPackage.factory(function packageInfo() {
      return {};
    });
    var dgeni = new Dgeni([mockPackage]);
    var injector = dgeni.configureInjector();

    expect(() => injector.get('gitRepoInfo')).toThrow();
  });
});
