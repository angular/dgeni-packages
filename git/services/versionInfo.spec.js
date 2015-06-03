var rewire = require('rewire');
var mocks = require('../mocks/mocks.js');
var versionInfoFactory = rewire('./versionInfo.js');
var semver = require('semver');

describe("versionInfo", function() {
  var versionInfo, mockSetDocsUrl, shell, shellMocks;

  beforeEach(function() {
    shell = versionInfoFactory.__get__('shell');

    shellMocks = {
      ls: mocks.mockGitLsRemoteTags,
      rev: mocks.mockGitRevParse,
      describe: mocks.mockShellDefault,
      cat: mocks.mockShellDefault
    };

    shell.exec = function (input) {
      if (input.indexOf('git ls-remote --tags ') == 0) {
        return shellMocks.ls;
      } else if (input.indexOf('git rev-parse') == 0) {
        return shellMocks.rev;
      } else if (input.indexOf('git describe --exact-match') == 0) {
        return shellMocks.describe;
      } else if (input.indexOf('git cat-file') == 0) {
        return shellMocks.cat;
      } else {
        return mocks.mockShellDefault;
      }
    };


    versionInfo = versionInfoFactory(
      function() {},
      mocks.packageWithVersion
    );

  });

  describe("currentPackage", function() {
    it("should be set", function() {
      expect(versionInfo.currentPackage).not.toBe(null);
    });
  });

  describe("gitRepoInfo", function() {
    it("should be set", function() {
      expect(versionInfo.gitRepoInfo).not.toBe(null);
    });

    it("should have owner set from package repository url", function() {
      expect(versionInfo.gitRepoInfo.owner).toBe('owner');
    });

    it("should have repo set from package repository url", function() {
      expect(versionInfo.gitRepoInfo.repo).toBe('repo');
    });
  });

  describe("previousVersions", function() {
    it("should read from git ls-remote", function() {
      expect(versionInfo.previousVersions.length).toBe(2);
    });

    it("should all be decorated", function() {
      var decorator = function(version) {
        version.decoration = "decorated"
      };

      versionInfo = versionInfoFactory(
        decorator,
        mocks.packageWithVersion
      );

      expect(versionInfo.previousVersions.every(function(item) {
        return item.decoration == "decorated";
      })).toBeTruthy();
    });
  });

  describe("currentVersion with no tag", function() {
    it("should have isSnapshot set to true", function() {
      expect(versionInfo.currentVersion.isSnapshot).toBe(true);
    });

    it("should have codeName of snapshot", function() {
      expect(versionInfo.currentVersion.codeName).toBe('snapshot');
    });

    it("should have the commitSHA set", function() {
      expect(versionInfo.currentVersion.commitSHA).toBe(mocks.mockGitRevParse.output);
    });

    describe("with branchVersion/Pattern", function() {
      beforeEach(function() {
        versionInfo = versionInfoFactory(
          function(){},
          mocks.packageWithBranchVersion
        );
      });

      it("should satisfy the branchVersion", function() {
        expect(semver.satisfies(versionInfo.currentVersion, mocks.packageWithBranchVersion.branchVersion))
          .toBeTruthy();
      });

      it("should have a prerelease", function() {
        expect(versionInfo.currentVersion.prerelease).toBeTruthy();
      });
    });

    describe("with no BUILD_NUMBER", function() {
      it("should have a local prerelease", function() {
        expect(versionInfo.currentVersion.prerelease[0]).toBe('local');
      });
    });

    describe("with a BUILD_NUMBER", function() {
      it("should have a build prerelease", function() {
        process.env.TRAVIS_BUILD_NUMBER = '10';

        versionInfo = versionInfoFactory(
          function() {},
          mocks.packageWithVersion
        );

        expect(versionInfo.currentVersion.prerelease[0]).toBe('build');
        expect(versionInfo.currentVersion.prerelease[1]).toBe('10');
      });
    });
  });


  describe("currentVersion with annotated tag", function() {

    beforeEach(function() {
      shellMocks.ls = mocks.mockShellDefault;
      shellMocks.cat = mocks.mockGitCatFile;
      shellMocks.describe = mocks.mockGitDescribe;

      versionInfo = versionInfoFactory(
        function() {},
        mocks.packageWithVersion
      );
    });

    it("should have a version matching the tag", function() {
      var tag = shellMocks.describe.output.trim();
      var version = semver.parse(tag);
      expect(versionInfo.currentVersion.version).toBe(version.version);
    });

    it("should pull the codeName from the tag", function() {
      expect(versionInfo.currentVersion.codeName).toBe('mockCodeName');
    });

    it("should throw an error if it doesn't have a codename specified", function() {
      shellMocks.cat = mocks.mockGitCatFileNoCodeName;

      expect(versionInfoFactory).toThrow();
    });

    it("should throw an error if it has a bad format for the codename", function() {
      shellMocks.cat = mocks.mockGitCatFileBadFormat;

      expect(versionInfoFactory).toThrow();
    });

    it("should have the commitSHA set", function() {
      expect(versionInfo.currentVersion.commitSHA).toBe(mocks.mockGitRevParse.output);
    });
  });


});
