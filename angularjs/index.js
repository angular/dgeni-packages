var path = require('canonical-path');
var packagePath = __dirname;
var Package = require('dgeni').Package;

module.exports = new Package('angularjs', ['jsdoc'])

.factory(require('./services/moduleDefs'))
.factory(require('./services/moduleExtractor'))
.factory(require('../ngdoc/services/getAliases'))

.processor(require('./processors/extractAngularModules'))
.processor(require('./processors/generateModuleDocs'))
.processor(require('./processors/generateControllerDocs'))
.processor(require('./processors/generateFilterDocs'))
.processor(require('./processors/generateDirectiveDocs'))
.processor(require('./processors/generateServiceComponentDocs'))
.processor(require('./processors/generateProviderDocs'))

.config(function(computeIdsProcessor, getAliases) {
  computeIdsProcessor.idTemplates.push({
    docTypes: ['ngModule', 'componentGroup', 'ngController', 'ngDirective'],
    //idTemplate: 'module:${module}.${docType}:${name}',
    getAliases: getAliases
  });
})

.config(function(computePathsProcessor) {
  computePathsProcessor.pathTemplates.push({
    docTypes: ['ngModule', 'componentGroup', 'ngController', 'ngDirective'],
    pathTemplate: '${id}',
    outputPathTemplate: '${path}.html'
  });
});