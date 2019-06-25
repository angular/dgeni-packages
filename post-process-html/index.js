var Package = require('dgeni').Package;
var base = require('../base');

/**
 * @dgPackage post-process-package
 */
module.exports = new Package('post-process-package', [base])
  .processor(require('./processors/post-process-html'));
