"use strict";

/**
 * @dgService gitData
 * @description
 * Information from the local git repository
 */
module.exports = function gitData(versionInfo) {
  return {
    version: versionInfo.currentVersion,
    versions: versionInfo.previousVersions,
    info: versionInfo.gitRepoInfo
  };
};
