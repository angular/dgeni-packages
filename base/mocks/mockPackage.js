const Package = require('dgeni').Package;

module.exports = function mockPackage() {

  return new Package('mockPackage', [require('../')])

  // provide a mock log service
  .factory('log', function log() { return require('dgeni/lib/mocks/log')(false); })

  // provide a mock template engine for the tests
  .factory('templateEngine', function dummyTemplateEngine() {
    const renderSpy = jasmine.createSpy('templateEngine');
    return {
      getRenderer() { return renderSpy; }
    };
  });
};
