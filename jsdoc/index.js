var path = require('canonical-path');
var Package = require('dgeni').Package;

module.exports = new Package('jsdoc', [require('../base')])

// Add in extra pseudo marker processors
.processor({ name: 'parsing-tags', $runAfter: ['files-read'], $runBefore: ['processing-docs'] })
.processor({ name: 'tags-parsed', $runAfter: ['parsing-tags'], $runBefore: ['processing-docs'] })
.processor({ name: 'extracting-tags', $runAfter: ['tags-parsed'], $runBefore: ['processing-docs'] })
.processor({ name: 'tags-extracted', $runAfter: ['extracting-tags'], $runBefore: ['processing-docs'] })

// Add in the real processors for this package
.processor(require('./processors/code-name'))
.processor(require('./processors/parse-tags'))
.processor(require('./processors/extract-tags'))
.processor(require('./processors/inline-tags'))


.factory(require('./services/transforms/extract-name'))
.factory(require('./services/transforms/extract-type'))
.factory(require('./services/transforms/unknown-tag'))
.factory(require('./services/transforms/whole-tag'))
.factory(require('./services/transforms/trim-whitespace'))

.factory(require('./file-readers/jsdoc'))

// Configure the processors

.config(function(readFilesProcessor, jsdocFileReader) {
  readFilesProcessor.fileReaders = [jsdocFileReader];
})

.config(function(parseTagsProcessor, getInjectables) {
  parseTagsProcessor.tagDefinitions = getInjectables(require('./tag-defs'));
})

.config(function(extractTagsProcessor, trimWhitespaceTransform) {
  extractTagsProcessor.defaultTagTransforms = [trimWhitespaceTransform];
})

// Configure the processors
.config(function(computePathsProcessor) {
  computePathsProcessor.pathTemplates = [
    // Default path processor template
    {
      getPath: function(doc) {
        var docPath = path.dirname(doc.fileInfo.relativePath);
        if ( doc.fileInfo.baseName !== 'index' ) {
          docPath = path.join(docPath, doc.fileInfo.baseName);
        }
        return doc.name || doc.codeName || docPath;
      },
      getOutputPath: function(doc) {
        return doc.path +
            ( doc.fileInfo.baseName === 'index' ? '/index.html' : '.html');
      }
    }
  ];
});