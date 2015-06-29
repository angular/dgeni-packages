var Package = require('dgeni').Package;
var mocks = require('./mocks.js');

module.exports = function mockPackage() {

  return new Package('mockPackage', [require('../'), require('../../base')])

  .factory('decorateVersion', function() { return mocks.decorateVersion })
  .factory('getPreviousVersions', function() { return mocks.getPreviousVersions; })
  .factory('gitData', function() { return mocks.gitData; })
  .factory('gitRepoInfo', function() { return mocks.gitRepoInfo })
  .factory('packageInfo', function() { return mocks.packageWithVersion })
  .factory('versionInfo', function() { return mocks.versionInfo })

  // provide a mock log service
  .factory('log', function() { return require('dgeni/lib/mocks/log')(false); })

  // provide a mock template engine for the tests
  .factory('templateEngine', function dummyTemplateEngine() {});
};
