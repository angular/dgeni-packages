var rewire = require('rewire');
var gitDataFactory = rewire('./gitData.js');
var mocks = require('../mocks/mocks.js');

describe("gitData", function() {
  var gitData, mockVersionInfo;

  beforeEach(function() {
    mockVersionInfo = mocks.mockVersionInfo;

    gitData = gitDataFactory(mockVersionInfo);
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
