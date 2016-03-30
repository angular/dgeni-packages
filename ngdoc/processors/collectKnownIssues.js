module.exports = function collectKnownIssuesProcessor() {
  return {
    $runAfter: ['moduleDocsProcessor'],
    $runBefore: ['computing-paths'],
    $process: function(docs) {
      docs
        .filter(function(doc) { return doc.knownIssues && doc.knownIssues.length; })
        .forEach(function(doc) {
          var moduleDoc = doc.moduleDoc;
          moduleDoc.knownIssueDocs = moduleDoc.knownIssueDocs || [];
          moduleDoc.knownIssueDocs.push(doc);
        });
    }
  };
};