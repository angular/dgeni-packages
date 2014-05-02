var _ = require('lodash');
var path = require('canonical-path');
var packagePath = __dirname;

module.exports = function(config) {

  require('../jsdoc')(config);
  require('../nunjucks')(config);

  config.merge('rendering.nunjucks.config.tags', {
    variableStart: '{$',
    variableEnd: '$}'
  });

  config.append('source.fileReaders', require('./file-readers/ngdoc'));

  config.append('processing.tagDefinitions', require('./tag-defs'));
  config.append('processing.inlineTagDefinitions', [
    require('./inline-tag-defs/link')
  ]);

  // Replace the default compute-path processor
  var processors = config.get('processing.processors');
  _.remove(processors, {name: 'compute-path'});
  config.append('processing.processors', [
    require('./processors/compute-path')
  ]);

  config.append('processing.processors', [
    require('./processors/partial-names'),
    require('./processors/filter-ngdocs'),
    require('./processors/compute-id'),
    require('./processors/api-docs'),
    require('./processors/component-groups-generate')
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
