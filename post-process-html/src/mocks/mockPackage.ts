import * as path from 'canonical-path';
import { Package } from 'dgeni';

export function mockPackage(mockTemplateEngine: boolean): Package {
  const pkg = new Package('mockPackage', [require('../')]);

  // provide a mock log service
  pkg.factory('log', function log() { return require('dgeni/lib/mocks/log')(false); });

  // overrides base packageInfo and returns the one for the 'angular/dgeni-packages' repo.
  const PROJECT_ROOT = path.resolve(__dirname, '../../');
  pkg.factory('packageInfo', function packageInfo() { return require(path.resolve(PROJECT_ROOT, 'package.json')); });

  if (mockTemplateEngine) {
    pkg.factory('templateEngine', function templateEngine() { return {}; });
  }

  return pkg;
}
