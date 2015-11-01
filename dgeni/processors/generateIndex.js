module.exports = function generateIndex() {
  return {
    $runAfter: ['adding-extra-docs'],
    $runBefore: ['extra-docs-added'],
    $process: function(docs) {
      var indexDoc = {
        docType: 'indexPage',
        name: 'index',
        packages: []
      };
      docs.forEach(function(doc) {
        if (doc.docType === 'dgPackage') {
          indexDoc.packages.push(doc);
        }
      });
      docs.push(indexDoc);
    }
  };
};