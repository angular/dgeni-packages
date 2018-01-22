var mockPackageFactory = require('../mocks/mockPackage');
var mockPackageFactoryHttp = require('../mocks/mockPackageHttp');
var Dgeni = require('dgeni');
var gitRepoInfoFactory = require('./gitRepoInfo');

describe("gitRepoInfo", function() {
  var gitRepoInfo, mockPackage;

  beforeEach(function() {
    mockPackage = mockPackageFactory()
      .factory(gitRepoInfoFactory);

    var dgeni = new Dgeni([mockPackage]);

    var injector = dgeni.configureInjector();
    gitRepoInfo = injector.get('gitRepoInfo');
  });

  it("should be set", function() {
    expect(gitRepoInfo).not.toBe(null);
  });

  it("should have owner set from package repository url", function() {
    expect(gitRepoInfo.owner).toBe('owner');
  });

  it("should have repo set from package repository url", function() {
    expect(gitRepoInfo.repo).toBe('repo');
  });

  it("should throw an error if packageInfo is empty", function() {
    mockPackage.factory(function packageInfo() {
      return {};
    });
    var dgeni = new Dgeni([mockPackage]);
    var injector = dgeni.configureInjector();

    expect(function(){injector.get('gitRepoInfo')}).toThrow();
  });

  it("should have owner and repo set from package repository http url", function() {
    var mockPackageHttp = mockPackageFactoryHttp()
      .factory(gitRepoInfoFactory);
    var dgeni = new Dgeni([mockPackageHttp]);
    var injector = dgeni.configureInjector();

    var gitRepoInfoHttp = injector.get('gitRepoInfo');
    expect(gitRepoInfoHttp.owner).toBe('owner-http');
    expect(gitRepoInfoHttp.repo).toBe('repo-http');
  });
});
