var mockPackageFactory = require('../mocks/mockPackage');
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

  it("should throw an error if not a github repo url", function() {
    var badPackage = {
      repository: {
        url: 'https://abc.com/foo/bar.git'
      }
    };

    mockPackage.factory(function packageInfo() {
      return badPackage;
    });
    var dgeni = new Dgeni([mockPackage]);
    var injector = dgeni.configureInjector();

    expect(function(){injector.get('gitRepoInfo')}).toThrow();

    expect(gitRepoInfoFactory).toThrow();
  });


});

