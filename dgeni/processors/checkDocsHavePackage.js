module.exports = function checkDocsHavePackage(createDocMessage) {
  return {
    $runAfter: ['readPackageInfo'],
    $runBefore: ['computing-ids'],
    docTypes: ['dgProcessor', 'dgService'],
    $process(docs) {
      const docTypes = this.docTypes;
      docs.forEach(doc => {
        if (!doc.packageDoc && docTypes.indexOf(doc.docType) !== -1) {
          throw new Error(createDocMessage('Failed to find package for ' + doc.codeName, doc));
        }
      });
    }
  };
};