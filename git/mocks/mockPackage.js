var Package = require('dgeni').Package;
var mocks = require('./mocks.js');

module.exports = function mockPackage() {

  return new Package('mockPackage')

  .factory('decorateVersion', function() { return mocks.decorateVersion })
  .factory('getPreviousVersions', function() { return mocks.getPreviousVersions; })
  .factory('gitData', function() { return mocks.gitData; })
  .factory('gitRepoInfo', function() { return mocks.gitRepoInfo })
  .factory('packageInfo', function() { return mocks.packageWithVersion })
  .factory('versionInfo', function() { return mocks.versionInfo })
};
