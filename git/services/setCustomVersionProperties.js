"use strict";

/**
 * @dgService setCustomVersionProperties
 * @description
 * A function that sets customProperties, this version sets defaults used by the angular.js project.
 */
module.exports = function setCustomVersionProperties() {

  /**
   * Set the some custom properties on version
   * @param {SemVer} version should be a semver version.
   */
  return function(version) { 
    // angular.js didn't follow semantic version until 1.2.0rc1
    if ((version.major === 1 && version.minor === 0 && version.prerelease.length > 0) || (version.major === 1 && version.minor === 2 && version.prerelease[0] === 'rc1')) {
      version.version = [version.major, version.minor, version.patch].join('.') + version.prerelease.join('');
      version.raw = 'v' + version.version;
    }

    version.docsUrl = 'http://code.angularjs.org/' + version.version + '/docs';

    // Versions before 1.0.2 had a different docs folder name
    if (version.major < 1 || (version.major === 1 && version.minor === 0 && version.patch < 2)) {
      version.docsUrl += '-' + version.version;
      version.isOldDocsUrl = true;
    }
  };
};
