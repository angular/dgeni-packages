var mocks = require('../mocks/mocks');
var mockPackageFactory = require('../mocks/mockPackage');
var Dgeni = require('dgeni');
var gitDataFactory = require('./gitData');



describe("gitData", function() {
  var gitData;

  beforeEach(function() {
    mockPackage = mockPackageFactory()
      .factory(gitDataFactory);

    var dgeni = new Dgeni([mockPackage]);

    var injector = dgeni.configureInjector();
    gitData = injector.get('gitData');

  });

  describe("version", function() {
    it("should be set to currentVersion of versionInfo", function() {
      expect(gitData.version).toEqual(mocks.versionInfo.currentVersion);
    });
  });

  describe("versions", function() {
    it("should be set to previousVersions of versionInfo", function() {
      expect(gitData.versions).toEqual(mocks.versionInfo.previousVersions);
    });
  });

  describe("info", function() {
    it("should be set to gitRepoInfo of versionInfo", function() {
      expect(gitData.info).toEqual(mocks.versionInfo.gitRepoInfo);
    });
  });
});
