var sortByDependency = require('dgeni/lib/util/dependency-sort');

module.exports = function computeProcessorPipeline() {
  return {
    $runAfter: ['readPackageInfo'],
    $runBefore: ['rendering-docs'],
    $process: function(docs) {
      docs.forEach(function(doc) {
        if (doc.docType === 'dgPackage') {
          var processors = collectProcessors(doc);
          doc.pipeline = sortByDependency(processors, '$runAfter', '$runBefore');
        }
      });
    }
  };
};

function collectProcessors(doc) {
  var processors = [].concat(doc.processors);
  doc.dependencies.forEach(function(dependency) {
    processors = processors.concat(collectProcessors(dependency));
  });
  return processors;
}