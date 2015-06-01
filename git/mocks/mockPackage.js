var Package = require('dgeni').Package;

module.exports = function mockPackage() {

  return new Package('mockPackage', [require('../')])
    // provide a mock template engine for the tests
    .factory('renderDocsProcessor', function dummyRenderDocsProcessor() {
      var renderSpy = jasmine.createSpy('extraData');
      return {
        extraData: renderSpy 
      };
    });

};
