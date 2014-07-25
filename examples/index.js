var path = require('canonical-path');
var packagePath = __dirname;
var Package = require('dgeni').Package;

module.exports = new Package('examples', ['jsdoc'])

.processor(require('./processors/examples-parse'))
.processor(require('./processors/examples-generate'))

.factory(require('./services/examples'))
.factory(require('./inline-tag-defs/runnableExample'))

.config(function(templateFinder, generateExamplesProcessor) {
  generateExamplesProcessor.templateFolder = 'examples';
  templateFinder.templateFolders.unshift(path.resolve(packagePath, 'templates'));
})

.config(function(inlineTagProcessor, runnableExampleInlineTagDef) {
  inlineTagProcessor.inlineTagDefinitions.push(runnableExampleInlineTagDef);
});