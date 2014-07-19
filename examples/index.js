var path = require('canonical-path');
var packagePath = __dirname;
var Package = require('dgeni').Package;

module.exports = new Package('examples')

.processor(require('./processors/examples-parse'))
.processor(require('./processors/examples-generate'))

.factory(require('./services/examples'))
.factory(require('./inline-tag-defs/runnableExample'))

.config(function(templateEngine, generateExamplesProcessor) {
  generateExamplesProcessor.templateFolder = path.resolve(packagePath, 'templates');
  templateEngine.templateFolders.shift(generateExamplesProcessor.templateFolder);
})

.config(function(inlineTagProcessor, runnableExampleInlineTagDef) {
  inlineTagProcessor.inlineTagDefinitions.push(require('./inline-tag-defs/runnableExample'));
});