/**
 * @dgProcessor codeNameProcessor
 * @description  Infer the name of the document from name of the following code
 */
module.exports = function codeNameProcessor(log, codeNameService) {
  return {
    $runAfter: ['files-read'],
    $runBefore: ['processing-docs'],
    $process: function(docs) {
      docs.forEach(function(doc) {
        doc.codeName = doc.codeName || (doc.codeNode && codeNameService.find(doc.codeNode)) || null;
        if ( doc.codeName ) {
          log.silly('found codeName: ', doc.codeName);
        }
      });
      return docs;
    }
  };
};
