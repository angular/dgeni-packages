const rewire = require('rewire');
const semver = require('semver');
const Dgeni = require('dgeni');

const mocks = require('../mocks/mocks.js');
const mockPackageFactory = require('../mocks/mockPackage');

const versionInfoFactory = rewire('./versionInfo.js');


describe("versionInfo", () => {
  let versionInfo, mockPackage, gitMocks, ciBuild;

  beforeEach(() => {
    mocks.getPreviousVersions.calls.reset();

    const child = versionInfoFactory.__get__('child');

    gitMocks = {
      rev: mocks.mockGitRevParse,
      describe: mocks.mockDefaultFail,
      cat: mocks.mockDefaultFail
    };

    spyOn(child, 'spawnSync').and.callFake((command, args) => {
      if (args[0] === 'rev-parse') {
        return gitMocks.rev;
      } else if (args[0] === 'describe') {
        return gitMocks.describe;
      } else if (args[0] === 'cat-file') {
        return gitMocks.cat;
      } else {
        return mocks.mockDefaultFail;
      }
    });

    mockPackage = mockPackageFactory()
      .factory(versionInfoFactory);

    const dgeni = new Dgeni([mockPackage]);

    const injector = dgeni.configureInjector();
    versionInfo = injector.get('versionInfo');

    ciBuild = process.env.TRAVIS_BUILD_NUMBER;
  });

  afterEach(() => {
    process.env.TRAVIS_BUILD_NUMBER = ciBuild;
  });

  describe("currentPackage", () => {
    it("should be set", () => {
      expect(versionInfo.currentPackage).not.toBe(null);
    });

    it("should be set to passed in package", () => {
      expect(versionInfo.currentPackage).toBe(mocks.packageWithVersion);
    });
  });

  it("should set gitRepoInfo", () => {
    expect(versionInfo.gitRepoInfo).toBe(mocks.gitRepoInfo);
  });

  describe("previousVersions", () => {
    it("should call getPreviousVersions", () => {
      expect(mocks.getPreviousVersions.calls.all().length).toEqual(1);
      expect(mocks.getPreviousVersions).toHaveBeenCalled();
    });

    it("should equal getPreviousVersions", () => {
      expect(mocks.getPreviousVersions.calls.all().length).toEqual(1);
      expect(versionInfo.previousVersions).toEqual(mocks.getPreviousVersions());
    });
  });

  describe("currentVersion with no tag", () => {
    it("should have isSnapshot set to true", () => {
      expect(versionInfo.currentVersion.isSnapshot).toBe(true);
    });

    it("should have codeName of snapshot", () => {
      expect(versionInfo.currentVersion.codeName).toBe('snapshot');
    });

    it("should have the commitSHA set", () => {
      expect(versionInfo.currentVersion.commitSHA).toBe(mocks.mockGitRevParse.stdout);
    });

    describe("with branchVersion/Pattern", () => {
      beforeEach(() => {
        versionInfo = versionInfoFactory(
          () => [],
          mocks.packageWithBranchVersion
        );
      });

      it("should satisfy the branchVersion", () => {
        expect(semver.satisfies(versionInfo.currentVersion, mocks.packageWithBranchVersion.branchVersion))
          .toBeTruthy();
      });

      it("should have a prerelease", () => {
        expect(versionInfo.currentVersion.prerelease).toBeTruthy();
      });
    });

    describe("with no BUILD_NUMBER", () => {
      it("should have a local prerelease", () => {
        delete process.env.TRAVIS_BUILD_NUMBER;

        versionInfo = versionInfoFactory(
          () => [],
          mocks.packageWithVersion
        );

        expect(versionInfo.currentVersion.prerelease[0]).toBe('local');
      });
    });

    describe("with a BUILD_NUMBER", () => {
      it("should have a build prerelease", () => {
        process.env.TRAVIS_BUILD_NUMBER = '10';

        versionInfo = versionInfoFactory(
          () => [],
          mocks.packageWithVersion
        );

        expect(versionInfo.currentVersion.prerelease[0]).toBe('build');
        expect(versionInfo.currentVersion.prerelease[1]).toBe('10');
      });
    });
  });


  describe("currentVersion with annotated tag", () => {

    beforeEach(() => {
      gitMocks.cat = mocks.mockGitCatFile;
      gitMocks.describe = mocks.mockGitDescribe;

      versionInfo = versionInfoFactory(
        () => [],
        mocks.packageWithVersion
      );
    });

    it("should have a version matching the tag", () => {
      const tag = gitMocks.describe.stdout.trim();
      const version = semver.parse(tag);
      expect(versionInfo.currentVersion.version).toBe(version.version);
    });

    it("should pull the codeName from the tag", () => {
      expect(versionInfo.currentVersion.codeName).toBe('mockCodeName');
    });

    it("should set codeName to null if it doesn't have a codename specified", () => {
      gitMocks.cat = mocks.mockGitCatFileNoCodeName;

      const dgeni = new Dgeni([mockPackage]);
      const injector = dgeni.configureInjector();
      versionInfo = injector.get('versionInfo');
      expect(versionInfo.currentVersion.codeName).toBe(null);
    });

    it("should set codeName to falsy if it has a badly formatted codename", () => {
      gitMocks.cat = mocks.mockGitCatFileBadFormat;

      const dgeni = new Dgeni([mockPackage]);
      const injector = dgeni.configureInjector();
      versionInfo = injector.get('versionInfo');
      expect(versionInfo.currentVersion.codeName).toBeFalsy();
    });

    it("should have the commitSHA set", () => {
      expect(versionInfo.currentVersion.commitSHA).toBe(mocks.mockGitRevParse.stdout);
    });
  });


});
