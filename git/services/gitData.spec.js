var mocks = require('../mocks/mocks');
var mockPackageFactory = require('../mocks/mockPackage');
var Dgeni = require('dgeni');
var gitDataFactory = require('./gitData');



describe("gitData", () => {
  var gitData;

  beforeEach(() => {
    mockPackage = mockPackageFactory()
      .factory(gitDataFactory);

    var dgeni = new Dgeni([mockPackage]);

    var injector = dgeni.configureInjector();
    gitData = injector.get('gitData');

  });

  describe("version", () => {
    it("should be set to currentVersion of versionInfo", () => {
      expect(gitData.version).toEqual(mocks.versionInfo.currentVersion);
    });
  });

  describe("versions", () => {
    it("should be set to previousVersions of versionInfo", () => {
      expect(gitData.versions).toEqual(mocks.versionInfo.previousVersions);
    });
  });

  describe("info", () => {
    it("should be set to gitRepoInfo of versionInfo", () => {
      expect(gitData.info).toEqual(mocks.versionInfo.gitRepoInfo);
    });
  });
});
