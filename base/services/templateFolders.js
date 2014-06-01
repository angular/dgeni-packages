var _ = require('lodash');
var path = require('canonical-path');

module.exports = function templateFoldersFactory(config, basePath) {
  var templateFolders = config.get('templateFinder.templateFolders');
  if ( !templateFolders ) {
    throw new Error('Invalid configuration.  You must provide "templateFinder.templateFolders".');
  }
  // Resolve the paths to the templates and output folder
  return _.map(templateFolders, function(templateFolder) {
    return path.resolve(basePath, templateFolder);
  });
};