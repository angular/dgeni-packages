var Package = require('dgeni').Package;

module.exports = new Package('angularjs', ['jsdoc'])

.factory(require('./services/moduleDefs'))
.factory(require('./services/moduleRegistrationTypes'))
.factory(require('./services/getJsDocComment'))
.factory(require('./services/moduleExtractor'))
.factory(require('./services/removeASTComment'))
.factory(require('./services/getPathFromId'))

.processor(require('./processors/extractAngularModules'))
.processor(require('./processors/generateModuleDocs'))
//.processor(require('./processors/generateServiceFromProvider'))

.config(function(computeIdsProcessor, getAliases) {
  computeIdsProcessor.idTemplates.push({
    docTypes: ['ngModule', 'componentGroup', 'ngController', 'ngDirective', 'ngService', 'ngConstant', 'ngProvider'],
    idTemplate: 'module:${module}.${docType}:${name}',
    getAliases: getAliases
  });
})

.config(function(computePathsProcessor, getPathFromId) {
  computePathsProcessor.pathTemplates.push({
    docTypes: ['ngModule', 'componentGroup', 'ngController', 'ngDirective', 'ngService', 'ngConstant', 'ngProvider'],
    getPath: getPathFromId,
    outputPathTemplate: '${path}index.html'
  });
})

.config(function(templateEngine, getInjectables) {
  templateEngine.filters = templateEngine.filters.concat(getInjectables([
    require('./rendering/relativeLink'),
  ]));
})


.config(function(getLinkInfo) {
  getLinkInfo.relativeLinks = true;
})