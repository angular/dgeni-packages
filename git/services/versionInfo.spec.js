var rewire = require('rewire');
var mockPackageJson = require('../mocks/mockPackageJson.js');
var versionInfoFactory = rewire('./versionInfo.js');

describe("versionInfo", function() {
  var versionInfo, mockSetDocsUrl, shell;

  beforeEach(function() {
    var fs = versionInfoFactory.__get__('fs');
    fs.existsSync = function() {
      return true;
    };

    fs.readFileSync = function() {
      return JSON.stringify(mockPackageJson().packageWithVersion);
    };

    shell = versionInfoFactory.__get__('shell');
    shell.exec = function (input) {
      if (input.indexOf('git ls-remote --tags ') == 0) {
        return {
          code: 0,
          output: '85ae09c2119bf9b20cd45fc4e9dab77c5940d627	refs/tags/v0.10.11-rc2\n' + 
                  '373c3bf61785139a65e76c023e798b49b7437c37	refs/tags/v0.10.13\n' +
                  '573c3bf61795139a65e76c023e798b49b7437c37	refs/tags/v1.3.invalid' 

        };
      } else {
        return {
          code: 1,
          output: "default"
        };
      }
    };

  });

  describe("currentPackage", function() {
    it("should be set", function() {
      versionInfo = versionInfoFactory(function(){});
      expect(versionInfo.currentPackage).not.toBe(null);
    });
  });

  describe("gitRepoInfo", function() {
    it("should be set", function() {
      versionInfo = versionInfoFactory(function(){});
      expect(versionInfo.gitRepoInfo).not.toBe(null);
    });

    it("should have owner set from package repository url", function() {
      versionInfo = versionInfoFactory(function(){});
      expect(versionInfo.gitRepoInfo.owner).toBe('owner');
    });

    it("should have repo set from package repository url", function() {
      versionInfo = versionInfoFactory(function(){});
      expect(versionInfo.gitRepoInfo.repo).toBe('repo');
    });
  });

  describe("previousVersions", function() {
    it("should read from git ls-remote", function() {
      versionInfo = versionInfoFactory(function(){});
      expect(versionInfo.previousVersions.length).toBe(2);
    });
  });

  describe("snapshot version", function() {
    it("should have isSnapshot set to true", function() {
      versionInfo = versionInfoFactory(function(){});
      expect(versionInfo.currentVersion.isSnapshot).toBe(true);
    });
    it("should have codeName of snapshot", function() {
      versionInfo = versionInfoFactory(function(){});
      expect(versionInfo.currentVersion.codeName).toBe('snapshot');
    });
  });


  describe("tagged Version", function() {
    beforeEach(function() {
      shell.exec = function (input) {
        if (input.indexOf('git describe --exact-match') == 0) {
          return {code: 0, output: 'v0.10.15'};
        } else if (input.indexOf('git cat-file') == 0) {
          return {
            code: 0,
            output: 'codename(versionInfo)'
          };
        } else {
          return {
            code: 1,
            output: "default"
          };
        }
      };

      versionInfo = versionInfoFactory(function(){});

    });

    it("should have a version of 0.10.15", function() {
      expect(versionInfo.currentVersion.version).toBe('0.10.15');
    });

    it("should have a codename of 'versionInfo'", function() {
      expect(versionInfo.currentVersion.codeName).toBe('versionInfo');
    });
  });

});
