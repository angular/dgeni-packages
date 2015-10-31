var Package = require('dgeni').Package;

module.exports = function readPackageInfo() {
  return {
    $runAfter: ['tags-extracted'],
    $runBefore: ['computing-ids'],
    $process: function(docs) {
      docs.forEach(function(doc) {
        if(doc.docType === 'dgPackage') {

          // Create an instance of the processor and extract the interesting properties
          doc.package = require(doc.fileInfo.filePath);
          doc.services = [];

          // Wire up the processor docs
          doc.processors = doc.package.processors.map(function(processorName) {

            processorName = processorName.name || processorName;

            // TODO - yes this is horribly slow :-)
            var processorDoc = docs.filter(function(doc) {
              if (doc.docType === 'dgProcessor') {
                return processorName === doc.name || processorName === doc.codeName;
              }
            })[0];

            if (!processorDoc) {
              processorDoc = {
                docType: 'dgProcessor'
              };
              docs.push(processorDoc);
            }

            // No doc for this processor so get it from the package
            var processor = doc.package.module[processorName][1];
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
          doc.dependencies = doc.package.dependencies.map(function(dependency) {

            // TODO - yes this is horribly slow :-)
            var packageDoc = docs.filter(function(doc) {
              return dependency.name === doc.name || dependency === doc.name;
            })[0];

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