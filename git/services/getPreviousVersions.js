'use strict';

const child = require('child_process');
const semver = require('semver');

const GIT = process.env.GIT_BIN || 'git';

/**
 * Get a collection of all the previous versions sorted by semantic version
 *
 * You can configure how versions are matched in the output from the `git ls-remote` call by setting the
 * `getPreviousVersions.versionMatcher` property to a regular expression, whose first group is the version
 * to extract.
 *
 * @param {Function} decorateVersion A function to set additional properties on the generated SemVer objects
 * @param packageInfo the JSON parsed package.json object
 * @return {Array.<SemVer>} The collection of previous versions
 */
module.exports = function getPreviousVersions(decorateVersion, packageInfo) {
  function getPreviousVersionsImpl() {
    // always use the remote tags as the local clone might
    // not contain all commits when cloned with git clone --depth=...
    // Needed e.g. for Travis
    const repo_url = packageInfo.repository.url;
    const tagResults = child.spawnSync(GIT, ['ls-remote', '--tags', repo_url], {encoding: 'utf8'});
    if (tagResults.status !== 0) {
      return [];
    }

    const matches = [];
    tagResults.stdout.replace(getPreviousVersionsImpl.versionMatcher, (_, match) => matches.push(match));

    return matches
        .map(tag => semver.parse(tag))
        .filter(tag => !!tag)
        .map(version => {
          decorateVersion(version);
          return version;
        })
        .sort(semver.compare);
  }

  getPreviousVersionsImpl.versionMatcher = /(v[0-9].*[0-9])$/mg;

  return getPreviousVersionsImpl;
};
