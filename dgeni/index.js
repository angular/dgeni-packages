var Package = require('dgeni').Package;
var path = require('canonical-path');

/**
 * @dgPackage dgeni
 * @description Support for documenting Dgeni packages (incomplete)
 */
module.exports = new Package('dgeni', [
  require('../jsdoc'),
  require('../nunjucks'),
  require('../links')
])

.processor(require('./processors/readPackageInfo'))
.processor(require('./processors/filterJSFileDocs'))
.processor(require('./processors/checkDocsHavePackage'))
.processor(require('./processors/wireUpServicesToPackages'))

.config(function(parseTagsProcessor, getInjectables) {
  parseTagsProcessor.tagDefinitions = parseTagsProcessor.tagDefinitions.concat(
    getInjectables([
      require('./tag-defs/dgPackage'),
      require('./tag-defs/dgService'),
      require('./tag-defs/dgProcessor')
    ]));
})

.config(function (computePathsProcessor, computeIdsProcessor) {
  computeIdsProcessor.idTemplates.push({
    docTypes: ['dgPackage'],
    idTemplate: '${name}',
    getAliases: function(doc) { return [doc.id]; }
  });

  computeIdsProcessor.idTemplates.push({
    docTypes: ['dgProcessor', 'dgService'],
    idTemplate: '${packageDoc.id}.${name}',
    getAliases: function(doc) { return [doc.name, doc.id]; }
  });

  computePathsProcessor.pathTemplates.push({
    docTypes: ['dgPackage'],
    pathTemplate: '${id}',
    outputPathTemplate: 'partials/${path}.html'
  });

  computePathsProcessor.pathTemplates.push({
    docTypes: ['dgProcessor'],
    pathTemplate: '${packageDoc.id}/processors/${name}',
    outputPathTemplate: 'partials/${path}.html'
  });
  computePathsProcessor.pathTemplates.push({
    docTypes: ['dgService'],
    pathTemplate: '${packageDoc.id}/services/${name}',
    outputPathTemplate: 'partials/${path}.html'
  });
})


.config(function(debugDumpProcessor) {
  debugDumpProcessor.$enabled = true;
});
