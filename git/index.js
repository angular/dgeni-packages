"use strict";

var Package = require('dgeni').Package;

/**
 * @dgPackage git
 * @description
 * Create and export a new Dgeni package called git. This package depends upon
 * the ngdoc, nunjucks, and examples packages defined in the dgeni-packages npm module.
 */
module.exports = new Package('git', [])


.factory(require('./services/gitData'))
.factory(require('./services/setCustomVersionProperties'))
.factory(require('./services/versionInfo'))

.config(function(renderDocsProcessor, gitData) {
  renderDocsProcessor.extraData.git = gitData;
});

