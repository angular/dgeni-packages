module.exports = function generateIndex() {
  return {
    $runAfter: ['adding-extra-docs'],
    $runBefore: ['extra-docs-added'],
    $process(docs) {
      const indexDoc = {
        docType: 'indexPage',
        name: 'index',
        packages: []
      };
      docs.forEach(doc => {
        if (doc.docType === 'dgPackage') {
          indexDoc.packages.push(doc);
        }
      });
      docs.push(indexDoc);
    }
  };
};