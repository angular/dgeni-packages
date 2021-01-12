const Package = require('dgeni').Package;

module.exports = function readPackageInfo() {
  return {
    $runAfter: ['tags-extracted'],
    $runBefore: ['computing-ids'],
    $process(docs) {
      docs.forEach(doc => {
        if(doc.docType === 'dgPackage') {

          // Create an instance of the processor and extract the interesting properties
          doc.package = require(doc.fileInfo.filePath);
          doc.services = [];

          // Wire up the processor docs
          doc.processors = doc.package.processors.map(processorName => {

            processorName = processorName.name || processorName;

            // TODO - yes this is horribly slow :-)
            let processorDoc = docs.find(doc => doc.docType === 'dgProcessor' && (processorName === doc.name || processorName === doc.codeName));

            if (!processorDoc) {
              processorDoc = {
                docType: 'dgProcessor'
              };
              docs.push(processorDoc);
            }

            // No doc for this processor so get it from the package
            let processor = doc.package.module[processorName][1];
            if (doc.package.module[processorName][0] === 'factory') {
              // processor is defined as a factory so we call it to get the definition
              processor = processor();
            }

            processorDoc.$runBefore = processor.$runBefore;
            processorDoc.$runAfter = processor.$runAfter;
            processorDoc.$validate = processor.$validate;
            processorDoc.$process = processor.$process;
            processorDoc.name = processorName;
            processorDoc.packageDoc = doc;

            return processorDoc;
          });


          // Wire up package dependency docs
          doc.dependencies = doc.package.dependencies.map(dependency => {

            // TODO - yes this is horribly slow :-)
            let packageDoc = docs.find(doc => dependency.name === doc.name || dependency === doc.name);

            if (!packageDoc) {
              // No doc for this dependency package so get it direcly from the package
              packageDoc = dependency instanceof Package ? dependency : { name: dependency };
            }

            return packageDoc;
          });
        }
      });
    }
  };
};