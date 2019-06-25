const path = require('canonical-path');

const Package = require('dgeni').Package;

module.exports = function mockPackage(mockTemplateEngine) {

  const pkg = new Package('mockPackage', [require('../')]);

  // provide a mock log service
  pkg.factory('log', function() { return require('dgeni/lib/mocks/log')(false); });

  // overrides base packageInfo and returns the one for the 'angular/dgeni-packages' repo.
  const PROJECT_ROOT = path.resolve(__dirname, '../../');
  pkg.factory('packageInfo', function() { return require(path.resolve(PROJECT_ROOT, 'package.json')); });


  if (mockTemplateEngine) {
    pkg.factory('templateEngine', function() { return {}; });
  }

  return pkg;
};
