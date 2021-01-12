module.exports = function wireUpServicesToPackages() {
  return {
    $runAfter: ['readPackageInfo'],
    $runBefore: ['checkDocsHavePackage'],
    $process(docs) {

      // Build a map of the service name to package doc
      const services = {};
      docs.forEach(doc => {
        if(doc.docType === 'dgPackage') {
          for(const serviceName in doc.package.module) {
            services[serviceName] = doc;
          }
        }
      });

      docs.forEach(doc => {
        if(doc.docType === 'dgService' || doc.docType === 'dgProcessor') {
          doc.name = doc.name || doc.codeName;
          doc.packageDoc = services[doc.name];
          doc.packageDoc.services.push(doc);
        }
      });
    }
  };
};
