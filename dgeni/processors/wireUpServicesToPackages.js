module.exports = function wireUpServicesToPackages() {
  return {
    $runAfter: ['readPackageInfo'],
    $runBefore: ['checkDocsHavePackage'],
    $process: function(docs) {

      // Build a map of the service name to package doc
      var services = {};
      docs.forEach(function(doc) {
        if(doc.docType === 'dgPackage') {
          var packageDoc = doc;
          for(serviceName in doc.package.module) {
            services[serviceName] = doc;
          }
        }
      });

      docs.forEach(function(doc) {
        if(doc.docType === 'dgService') {
          doc.name = doc.name || doc.codeName;
          doc.packageDoc = services[doc.name];
          doc.packageDoc.services.push(doc);
        }
      })
    }
  };
};