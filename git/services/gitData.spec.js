const mocks = require('../mocks/mocks');
const mockPackageFactory = require('../mocks/mockPackage');
const Dgeni = require('dgeni');
const gitDataFactory = require('./gitData');



describe("gitData", () => {
  let gitData, mockPackage;

  beforeEach(() => {
    mockPackage = mockPackageFactory()
      .factory(gitDataFactory);

    const dgeni = new Dgeni([mockPackage]);

    const injector = dgeni.configureInjector();
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
