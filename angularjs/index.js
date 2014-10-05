var path = require('canonical-path');
var packagePath = __dirname;
var Package = require('dgeni').Package;

module.exports = new Package('angularjs', ['jsdoc'])

.factory(require('./services/moduleDefs'))
.factory(require('./services/moduleExtractor'))
.factory(require('./services/removeASTComment'))
.factory(require('../ngdoc/services/getAliases'))

.processor(require('./processors/extractAngularModules'))
.processor(require('./processors/generateModuleDocs'))
//.processor(require('./processors/generateServiceFromProvider'))

.config(function(computeIdsProcessor, getAliases) {
  computeIdsProcessor.idTemplates.push({
    docTypes: ['ngModule', 'componentGroup', 'ngController', 'ngDirective', 'ngService', 'ngConstant'],
    idTemplate: 'module:${module}.${docType}:${name}',
    getAliases: getAliases
  });
})

.config(function(computePathsProcessor) {
  computePathsProcessor.pathTemplates.push({
    docTypes: ['ngModule', 'componentGroup', 'ngController', 'ngDirective', 'ngService', 'ngConstant'],
    pathTemplate: '${id}',
    outputPathTemplate: '${path}.html'
  });
});