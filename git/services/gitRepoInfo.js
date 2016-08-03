'use strict';

/**
 * Parse the github URL for useful information
 * @return {Object} An object containing the github owner and repository name
 */
module.exports = function gitRepoInfo(packageInfo) {
  var GITURL_REGEX = /^(?:git\+https|https?):\/\/[^/]+\/([^/]+)\/(.+).git$/;
  var match = GITURL_REGEX.exec(packageInfo.repository.url);
  return {
    owner: match[1],
    repo: match[2]
  };
}
