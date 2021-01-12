'use strict';

const child = require('child_process');
const semver = require('semver');

/**
 * Get a collection of all the previous versions sorted by semantic version
 * @param {Function} decorateVersion A function to set the docsUrl on the inputted SemVer
 * @return {Array.<SemVer>} The collection of previous versions
 */
module.exports = function getPreviousVersions(decorateVersion, packageInfo) {
  return () => {
    // always use the remote tags as the local clone might
    // not contain all commits when cloned with git clone --depth=...
    // Needed e.g. for Travis
    const repo_url = packageInfo.repository.url;
    const tagResults = child.spawnSync('git', ['ls-remote', '--tags', repo_url], {encoding: 'utf8'});
    if (tagResults.status !== 0) {
      return [];
    }

    const matches = tagResults.stdout.match(/v[0-9].*[0-9]$/mg);
    if (!matches) {
      return [];
    }

    return matches
        .map(tag => semver.parse(tag))
        .filter(tag => !!tag)
        .map(version => {
          decorateVersion(version);
          return version;
        })
        .sort(semver.compare);
  }
};
