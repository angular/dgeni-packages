var Package = require('dgeni').Package;

module.exports = new Package('jsdoc', ['base'])

// Add in extra pseudo marker processors
.processor({ name: 'parsing-tags', runAfter: ['files-read'], runBefore: ['processing-docs'] })
.processor({ name: 'tags-parsed', runAfter: ['parsing-tags'], runBefore: ['processing-docs'] })
.processor({ name: 'extracting-tags', runAfter: ['tags-parsed'], runBefore: ['processing-docs'] })
.processor({ name: 'tags-extracted', runAfter: ['extracting-tags'], runBefore: ['processing-docs'] })

// Add in the real processors for this package
.processor(require('./processors/code-name'))
.processor(require('./processors/parse-tags'))
.processor(require('./processors/extract-tags'))
.processor(require('./processors/compute-path'))
.processor(require('./processors/inline-tags'))

// Helper services
.service('tagDefinitions', require('./services/tagDefinitions'))
.service('tagDefMap', require('./services/tagDefMap'))
.service('tagParser', require('./services/tagParser'))
.service('tagExtractor', require('./services/tagExtractor'))
.service('defaultTagTransforms', require('./services/defaultTagTransforms'))

// Configure the basic file readers and jsdoc tag definitions
.config(function(config) {
  config.append('read-files.fileReaders', require('./file-readers/jsdoc'));
  config.append('processing.tagDefinitions', require('./tag-defs'));
  config.append('processing.defaultTagTransforms', require('./tag-defs/transforms/trim-whitespace'));
});