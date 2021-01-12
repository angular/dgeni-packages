module.exports = function filterJSFileDocs() {
  return {
    $runAfter: ['readPackageInfo'],
    $runBefore: ['rendering-docs'],
    $process(docs) {
      return docs.filter(doc => doc.docType !== 'js');
    }
  };
};