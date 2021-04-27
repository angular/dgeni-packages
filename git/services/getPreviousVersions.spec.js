const rewire = require('rewire');
const semver = require('semver');
var getPreviousVersionsFactory = rewire('./getPreviousVersions');
const Dgeni = require('dgeni');

const mocks = require('../mocks/mocks.js');
const mockPackageFactory = require('../mocks/mockPackage');

describe("getPreviousVersions", () => {
  let getPreviousVersions, child;

  beforeEach(() => {
    child = getPreviousVersionsFactory.__get__('child');

    const mockPackage = mockPackageFactory()
      .factory(getPreviousVersionsFactory);

    const dgeni = new Dgeni([mockPackage]);

    const injector = dgeni.configureInjector();
    getPreviousVersions = injector.get('getPreviousVersions');
  });

  it("should have called exec", () => {
    spyOn(child, 'spawnSync').and.returnValue({});
    getPreviousVersions();
    expect(child.spawnSync).toHaveBeenCalled();
  });

  it("should return an empty list for no tags", () => {
    spyOn(child, 'spawnSync').and.returnValue({});
    expect(getPreviousVersions()).toEqual([]);
  });

  it("should return an array of semvers matching tags", () => {
    spyOn(child, 'spawnSync').and.returnValue({
      status: 0,
      stdout: 'v0.1.1'
    });
    expect(getPreviousVersions()).toEqual([semver('v0.1.1')]);
  });

  it("should match v0.1.1-rc1", () => {
    spyOn(child, 'spawnSync').and.returnValue({
      status: 0,
      stdout: 'v0.1.1-rc1'
    });
    expect(getPreviousVersions()).toEqual([semver('v0.1.1-rc1')]);
  });

  it("should not match v1.1.1.1", () => {
    spyOn(child, 'spawnSync').and.returnValue({
      status: 0,
      stdout: 'v1.1.1.1'
    });
    expect(getPreviousVersions()).toEqual([]);
  });

  it("should not match v1.1.1-rc", () => {
    spyOn(child, 'spawnSync').and.returnValue({
      status: 0,
      stdout: 'v1.1.1-rc'
    });
    expect(getPreviousVersions()).toEqual([]);
  });

  it("should match multiple semvers", () => {
    spyOn(child, 'spawnSync').and.returnValue({
      status: 0,
      stdout: 'v0.1.1\nv0.1.2'
    });
    expect(getPreviousVersions()).toEqual([semver('v0.1.1'), semver('v0.1.2')]);
  });

  it("should sort multiple semvers", () => {
    spyOn(child, 'spawnSync').and.returnValue({
      status: 0,
      stdout: 'v0.1.1\nv0.1.1-rc1'
    });
    expect(getPreviousVersions()).toEqual([semver('v0.1.1-rc1'), semver('v0.1.1')]);
  });


  it("should decorate all versions", () => {
    mocks.decorateVersion.calls.reset();

    spyOn(child, 'spawnSync').and.returnValue({
      status: 0,
      stdout: 'v0.1.1\nv0.1.2'
    });
    const versions = getPreviousVersions();

    expect(mocks.decorateVersion.calls.allArgs())
    .toEqual([
      [semver('v0.1.1')],
      [semver('v0.1.2')]
      ]);
  });

  it('should allow the version matcher to be configured', () => {
    const previousMatcher = getPreviousVersions.versionMatch;
    try {
      getPreviousVersions.versionMatcher = /refs\/tags\/([0-9].*[0-9])$/mg;
      spyOn(child, 'spawnSync').and.returnValue({
        status: 0,
        stdout: 'blah blah  refs/tags/0.1.1\nblah blah  refs/tags/0.1.2'
      });
      const versions = getPreviousVersions();
      expect(versions).toEqual([semver('0.1.1'), semver('0.1.2')]);
    } finally {
      getPreviousVersions.versionMatch = previousMatcher;
    }
  });

});
