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
  "branchVersion": "^1.4.0-beta.0",
  "branchPattern": "1.4.*",
  "repository": {
    "type": "git",
    "url": "https://github.com/owner/repo.git"
  }
}

var mockVersionInfo = {
  currentVersion: 'currentVersion',
  previousVersions: 'previousVersions',
  gitRepoInfo: 'gitRepoInfo'
};

var mockGitLsRemoteTags = {
  code: 0,
  output: '85ae09c2119bf9b20cd45fc4e9dab77c5940d627	refs/tags/v0.10.11-rc2\n' +
          '373c3bf61785139a65e76c023e798b49b7437c37	refs/tags/v0.10.13\n' +
          '573c3bf61795139a65e76c023e798b49b7437c37	refs/tags/v1.3.invalid'
};

var mockGitRevParse = {
  code: 0,
  output: 'revision'
}

var mockGitCatFile = {
  code: 0,
  output: 'codename(mockCodeName)'
}

var mockGitCatFileNoCodeName = {
  code: 0,
  output: 'no code name'
}

var mockGitCatFileBadFormat = {
  code: 0,
  output: 'bad format codename()'
}

var mockGitDescribe = {
  code: 0,
  output: 'v0.10.15'
};

var mockShellDefault = {
  code: 1,
  output: "default"
};

module.exports = {
  packageWithVersion: packageWithVersion,
  packageWithBranchVersion: packageWithBranchVersion,
  mockVersionInfo: mockVersionInfo,
  mockGitLsRemoteTags: mockGitLsRemoteTags,
  mockGitRevParse: mockGitRevParse,
  mockGitDescribe: mockGitDescribe,
  mockGitCatFile: mockGitCatFile,
  mockGitCatFileNoCodeName: mockGitCatFileNoCodeName,
  mockGitCatFileBadFormat: mockGitCatFileBadFormat,
  mockShellDefault: mockShellDefault
};
