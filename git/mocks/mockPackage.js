var Package = require('dgeni').Package;
var mocks = require('./mocks.js');

module.exports = function mockPackage() {

  return new Package('mockPackage', [require('../'), require('../../base')])

  .factory('decorateVersion', function decorateVersion() { return mocks.decorateVersion })
  .factory('getPreviousVersions', function getPreviousVersions() { return mocks.getPreviousVersions; })
  .factory('gitData', function gitData() { return mocks.gitData; })
  .factory('gitRepoInfo', function gitRepoInfo() { return mocks.gitRepoInfo })
  .factory('packageInfo', function packageInfo() { return mocks.packageWithVersion })
  .factory('versionInfo', function versionInfo() { return mocks.versionInfo })

  // provide a mock log service
  .factory('log', function log() { return require('dgeni/lib/mocks/log')(false); })

  // provide a mock template engine for the tests
  .factory('templateEngine', function dummyTemplateEngine() {});
};
