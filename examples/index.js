const path = require('canonical-path');
var packagePath = __dirname;
const Package = require('dgeni').Package;

/**
 * @dgPackage examples
 * @description Processors to support the runnable examples feature in the AngularJS docs site.
 */
module.exports = new Package('examples', ['jsdoc'])

.processor(require('./processors/examples-parse'))
.processor(require('./processors/examples-generate'))
.processor(require('./processors/protractor-generate'))

.factory(require('./services/exampleMap'))
.factory(require('./inline-tag-defs/runnableExample'))

.config(function(templateFinder, generateExamplesProcessor) {
  templateFinder.templateFolders.push(path.resolve(packagePath, 'templates'));

})

.config(function(inlineTagProcessor, runnableExampleInlineTagDef) {
  inlineTagProcessor.inlineTagDefinitions.push(runnableExampleInlineTagDef);
})

.config(function(computePathsProcessor, computeIdsProcessor) {
  computePathsProcessor.pathTemplates.push({
    docTypes: ['example'],
    pathTemplate: 'examples/${example.id}',
    outputPathTemplate: 'examples/${example.id}/index${deploymentQualifier}.html'
  });
  computePathsProcessor.pathTemplates.push({
    docTypes: ['example-file'],
    getPath() {},
    outputPathTemplate: 'examples/${id}'
  });
  computePathsProcessor.pathTemplates.push({
    docTypes: ['runnableExample' ],
    pathTemplate: 'examples/${example.id}',
    getOutputPath() {},
  });

  computeIdsProcessor.idTemplates.push({
    docTypes: ['example', 'example-file', 'runnableExample'],
    getAliases(doc) { return [doc.id]; }
  });
});
