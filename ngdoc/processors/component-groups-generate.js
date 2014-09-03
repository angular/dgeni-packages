var _ = require('lodash');
var path = require('canonical-path');

module.exports = {
  name: 'component-groups-generate',
  description: 'Add new component-groups docs',
  runAfter: ['adding-extra-docs', 'api-docs'],
  runBefore: ['extra-docs-added'],
  process: function(docs, config, moduleMap) {

    var partialsPath = config.get('rendering.contentsFolder');
    if ( !partialsPath ) {
      throw new Error('Invalid configuration. You must provide config.rendering.contentsFolder');
    }

    var options = _.assign({
      outputPath: '${module.area}/${module.name}/${docType}/index.html',
      path: '${module.area}/${module.name}/${docType}'
    }, config.get('processing.component-groups', {}));

    _.forEach(moduleMap, function(module) {

      _(module.components)
        .groupBy('docType')
        .tap(function(docTypes) {
          // We don't want the overview docType to be represented as a componentGroup
          delete docTypes.overview;
        })
        .map(function(docs, docType) {
          return {
            id: module.id + '.' + docType,
            docType: 'componentGroup',
            name: docType + ' components in '  + module.id,
            groupType: docType,
            module: module.name,
            moduleDoc: module,
            area: module.area,
            components: docs,
            outputPath: path.join(partialsPath, _.template(options.outputPath, { module: module, docType: docType })),
            path: _.template(options.path, { module: module, docType: docType })
          };
        })
        .tap(function(groups) {
          module.componentGroups = groups;
          _.forEach(groups, function(group) {
            docs.push(group);
          });
        });
    });
  }
};