module.exports = function collectKnownIssuesProcessor() {
  return {
    $runAfter: ['moduleDocsProcessor'],
    $runBefore: ['computing-paths'],
    $process(docs) {
      docs
        .filter(doc => doc.knownIssues && doc.knownIssues.length)
        .forEach(doc => {
          const moduleDoc = doc.moduleDoc;
          moduleDoc.knownIssueDocs = moduleDoc.knownIssueDocs || [];
          moduleDoc.knownIssueDocs.push(doc);
        });
    }
  };
};