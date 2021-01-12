'use strict';

const fs = require('fs');
const path = require('canonical-path');

/**
 * Load information about this project from the package.json
 * @return {Object} The package information
 */
module.exports = function packageInfo() {
  // Search up the folder hierarchy for the first package.json
  let packageFolder = path.resolve('.');
  while (!fs.existsSync(path.join(packageFolder, 'package.json'))) {
    const parent = path.dirname(packageFolder);
    if (parent === packageFolder) { break; }
    packageFolder = parent;
  }

  return JSON.parse(fs.readFileSync(path.join(packageFolder,'package.json'), 'UTF-8'));
};

