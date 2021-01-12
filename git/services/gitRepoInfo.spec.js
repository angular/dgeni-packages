const mockPackageFactory = require('../mocks/mockPackage');
const Dgeni = require('dgeni');
const gitRepoInfoFactory = require('./gitRepoInfo');

describe("gitRepoInfo", () => {
  let gitRepoInfo, mockPackage;

  beforeEach(() => {
    mockPackage = mockPackageFactory()
      .factory(gitRepoInfoFactory);

    const dgeni = new Dgeni([mockPackage]);

    const injector = dgeni.configureInjector();
    gitRepoInfo = injector.get('gitRepoInfo');
  });

  it("should be set", () => {
    expect(gitRepoInfo).not.toBe(null);
  });

  it("should have owner set from package repository url", () => {
    expect(gitRepoInfo.owner).toBe('owner');
  });

  it("should have repo set from package repository url", () => {
    expect(gitRepoInfo.repo).toBe('repo');
  });

  it("should throw an error if packageInfo is empty", () => {
    mockPackage.factory(function packageInfo() {
      return {};
    });
    const dgeni = new Dgeni([mockPackage]);
    const injector = dgeni.configureInjector();

    expect(() => injector.get('gitRepoInfo')).toThrow();
  });
});
