var mockPackage = require('../mocks/mockPackage');
var Dgeni = require('dgeni');

describe("gitData", function() {
  var gitData, mockVersionInfo, mockPackageImpl;

  beforeEach(function() {
    mockVersionInfo = {
      currentVersion: 'currentVersion',
      previousVersions: 'previousVersions',
      gitRepoInfo: 'gitRepoInfo'
    };

    mockPackageImpl = mockPackage()
      .factory('versionInfo', function dummyVersionInfo() {
        return mockVersionInfo;
      });

    var dgeni = new Dgeni([mockPackageImpl]);

    var injector = dgeni.configureInjector();
    gitData = injector.get('gitData');
  });

  describe("version", function() {
    it("should be set to currentVersion of versionInfo", function() {
      expect(gitData.version).toEqual(mockVersionInfo.currentVersion);
    });
  });

  describe("versions", function() {
    it("should be set to previousVersions of versionInfo", function() {
      expect(gitData.versions).toEqual(mockVersionInfo.previousVersions);
    });
  });

  describe("info", function() {
    it("should be set to gitRepoInfo of versionInfo", function() {
      expect(gitData.info).toEqual(mockVersionInfo.gitRepoInfo);
    });
  });
});
