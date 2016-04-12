var path = require('canonical-path');
var Package = require('dgeni').Package;

/**
 * @dgPackage jsdoc
 * @description Tag parsing and extracting for JSDoc-based documentation
 */
module.exports = new Package('jsdoc', [require('../base')])

// Add in extra pseudo marker processors
.processor({ name: 'parsing-tags', $runAfter: ['files-read'], $runBefore: ['processing-docs'] })
.processor({ name: 'tags-parsed', $runAfter: ['parsing-tags'], $runBefore: ['processing-docs'] })
.processor({ name: 'extracting-tags', $runAfter: ['tags-parsed'], $runBefore: ['processing-docs'] })
.processor({ name: 'tags-extracted', $runAfter: ['extracting-tags'], $runBefore: ['processing-docs'] })

// Add in the real processors for this package
.processor(require('./processors/extractJSDocComments'))
.processor(require('./processors/code-name'))
.processor(require('./processors/parse-tags'))
.processor(require('./processors/extract-tags'))
.processor(require('./processors/inline-tags'))

.factory(require('./services/code-name-map'))
.factory(require('./services/code-name'))
.factory(require('./services/transforms/extract-access'))
.factory(require('./services/transforms/extract-name'))
.factory(require('./services/transforms/extract-type'))
.factory(require('./services/transforms/unknown-tag'))
.factory(require('./services/transforms/whole-tag'))
.factory(require('./services/transforms/trim-whitespace'))

.factory(require('./services/jsParser'))
.factory(require('./file-readers/jsdoc'))

// Configure the processors

.config(function(readFilesProcessor, jsdocFileReader) {
  readFilesProcessor.fileReaders = [jsdocFileReader].concat(readFilesProcessor.fileReaders || []);
})

.config(function(parseTagsProcessor, getInjectables) {
  parseTagsProcessor.tagDefinitions = getInjectables(require('./tag-defs'));
})

.config(function(extractTagsProcessor, trimWhitespaceTransform) {
  extractTagsProcessor.defaultTagTransforms = [trimWhitespaceTransform];
})

.config(function(computeIdsProcessor) {
  computeIdsProcessor.idTemplates.push({
    docTypes: ['js'],
    getId: function(doc) {
      var docPath = doc.name || doc.codeName;
      if ( !docPath ) {
        docPath = path.dirname(doc.fileInfo.relativePath);
        if ( doc.fileInfo.baseName !== 'index' ) {
          docPath = path.join(docPath, doc.fileInfo.baseName);
        }
      }
      return docPath;
    },
    getAliases: function(doc) {
      return [doc.id];
    }
  });
})

.config(function(computePathsProcessor) {
  computePathsProcessor.pathTemplates.push({
    docTypes: ['js'],
    pathTemplate: '${id}',
    outputPathTemplate: '${path}.html'
  });
})

.config(function(codeNameService, getInjectables) {
  codeNameService.matchers = getInjectables(require('./services/code-name-matchers'));
});
