var Package = require('dgeni').Package;

module.exports = new Package('base')

// Create a set of pseudo processors that act as markers to help position real
// processors at the right place in the pipeline
.processor('reading-files')
.processor('files-read', { $runAfter: ['reading-files'] })
.processor('processing-docs', { $runAfter: ['files-read'] })
.processor('docs-processed', { $runAfter: ['processing-docs'] })
.processor('adding-extra-docs', { $runAfter: ['docs-processed'] })
.processor('extra-docs-added', { $runAfter: ['adding-extra-docs'] })
.processor('rendering-docs', { $runAfter: ['extra-docs-added'] })
.processor('docs-rendered', { $runAfter: ['rendering-docs'] })
.processor('writing-files', { $runAfter: ['docs-rendered'] })
.processor('files-written', { $runAfter: ['writing-files'] })

// Add in the real processors for this package
.processor('readFiles', require('./processors/read-files'))
.processor('renderDocs', require('./processors/render-docs'))
.processor('unescapeComments', require('./processors/unescape-comments'))
.processor('writeFiles', require('./processors/write-files'))

// Helper services
.factory('templateFinder', require('./services/templateFinder'))
.factory('templateFolders', function() { return []; })
.factory('templatePatterns', function() { return []; })


.config(function(dgeni) {
  dgeni.basePath = process.cwd();
});