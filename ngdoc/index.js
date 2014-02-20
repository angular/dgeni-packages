var path = require('canonical-path');
var packagePath = __dirname;
var basePackage = require('../jsdoc');

module.exports = function(config) {

  config = basePackage(config);

  config.append('source.extractors', require('./extractors/ngdoc'));
  
  config.set('processing.tagDefinitions', require('./tag-defs'));

  config.append('processing.processors', [
    require('./processors/partial-names'),
    require('./processors/filter-ngdocs'),
    require('./processors/api-docs'),
    require('./processors/component-groups-generate'),
    require('./processors/links')
  ]);

  config.prepend('rendering.templateFolders', path.resolve(packagePath, 'templates'));

  config.prepend('rendering.templatePatterns', [
    '${ doc.template }',
    '${doc.area}/${ doc.id }.${ doc.docType }.template.html',
    '${doc.area}/${ doc.id }.template.html',
    '${doc.area}/${ doc.docType }.template.html',
    '${ doc.id }.${ doc.docType }.template.html',
    '${ doc.id }.template.html',
    '${ doc.docType }.template.html'
  ]);

  config.append('rendering.filters', [
    require('./rendering/filters/code'),
    require('./rendering/filters/link'),
    require('./rendering/filters/type-class')
  ]);

  config.append('rendering.tags', [
    require('./rendering/tags/code')
  ]);

  return config;
};