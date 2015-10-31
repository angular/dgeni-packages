module.exports = function filterJSFileDocs() {
  return {
    $runAfter: ['readPackageInfo'],
    $runBefore: ['rendering-docs'],
    $process: function(docs) {
      return docs.filter(function(doc) {
        return doc.docType !== 'js';
      });
    }
  };
};