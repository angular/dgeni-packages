"use strict";

var Package = require('dgeni').Package;

/**
 * @dgPackage git
 * @description
 * Create and export a new Dgeni package called git.
 */
module.exports = new Package('git', [])


.factory(require('./services/gitData'))
.factory(require('./services/packageInfo'))
.factory(require('./services/decorateVersion'))
.factory(require('./services/versionInfo'))

.config(function(renderDocsProcessor, gitData) {
  renderDocsProcessor.extraData.git = gitData;
});

