var path = require('canonical-path');
var packagePath = __dirname;
var Package = require('dgeni').Package;

module.exports = new Package('examples', ['jsdoc'])

.processor(require('./processors/examples-parse'))
.processor(require('./processors/examples-generate'))
.processor(require('./processors/protractor-generate'))

.factory(require('./services/examples'))
.factory(require('./inline-tag-defs/runnableExample'))

.config(function(templateFinder, generateExamplesProcessor) {
  generateExamplesProcessor.templateFolder = 'examples';
  templateFinder.templateFolders.unshift(path.resolve(packagePath, 'templates'));
})

.config(function(inlineTagProcessor, runnableExampleInlineTagDef) {
  inlineTagProcessor.inlineTagDefinitions.push(runnableExampleInlineTagDef);
})

.config(function(computePathsProcessor) {
  computePathsProcessor.pathTemplates.push({
    docTypes: ['example'],
    pathTemplate: '${example.id}/${id}',
    outputPathTemplate: '../examples/${example.id}/index${deployment}.html'
  });
  computePathsProcessor.pathTemplates.push({
    docTypes: [
      'example-css',
      'example-html',
      'example-js',
      'example-json',
      'example-protractor',
      'example-scenario',
      'example-spec',
      'example-manifest' ],
    pathTemplate: '${id}',
    outputPathTemplate: '../examples/${id}'
  });
  computePathsProcessor.pathTemplates.push({
    docTypes: ['runnableExample' ],
    getPath: function() {},
    getOutputPath: function() {}
  });
});