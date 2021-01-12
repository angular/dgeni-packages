var sortByDependency = require('dgeni/lib/util/dependency-sort').sortByDependency;

module.exports = function computeProcessorPipeline() {
  return {
    $runAfter: ['readPackageInfo'],
    $runBefore: ['rendering-docs'],
    $process(docs) {
      docs.forEach(doc => {
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
  doc.dependencies.forEach(dependency => {
    processors = processors.concat(collectProcessors(dependency));
  });
  return processors;
}
