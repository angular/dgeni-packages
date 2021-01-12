const sortByDependency = require('dgeni/lib/util/dependency-sort').sortByDependency;

module.exports = function computeProcessorPipeline() {
  return {
    $runAfter: ['readPackageInfo'],
    $runBefore: ['rendering-docs'],
    $process(docs) {
      docs.forEach(doc => {
        if (doc.docType === 'dgPackage') {
          const processors = collectProcessors(doc);
          doc.pipeline = sortByDependency(processors, '$runAfter', '$runBefore');
        }
      });
    }
  };
};

function collectProcessors(doc) {
  const processors = [...doc.processors];
  doc.dependencies.forEach(dependency => {
    processors.push(...collectProcessors(dependency));
  });
  return processors;
}
