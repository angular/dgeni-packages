const Package = require('dgeni').Package;

module.exports = function mockPackage() {

  return new Package('mockPackage', [require('../')])

  // provide a mock log service
  .factory('log', function log() { return require('dgeni/lib/mocks/log')(false); });
};
