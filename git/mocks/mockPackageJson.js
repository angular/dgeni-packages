var packageWithVersion = {
  "name": "dgeni-packages",
  "version": "0.10.13",
  "repository": {
    "type": "git",
    "url": "https://github.com/owner/repo.git"
  }
}

var packageWithBranchVersion = {
  "name": "dgeni-packages",
  "version": "0.10.13",
  "repository": {
    "type": "git",
    "url": "https://github.com/owner/repo.git"
  }
}

module.exports = function mockPackageJson() {
  return {
    packageWithVersion: packageWithVersion,
    packageWithBranchVersion: packageWithBranchVersion
  };
};
