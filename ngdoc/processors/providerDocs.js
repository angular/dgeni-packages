/**
 * @dgProcessor providerDocsProcessor
 * @description
 * Connect docs for services to docs for their providers
 */
module.exports = function providerDocsProcessor(log, aliasMap, createDocMessage) {
  return {
    $runAfter: ['ids-computed', 'memberDocsProcessor'],
    $runBefore: ['computing-paths'],
    $process(docs) {

      // Map services to their providers
      docs.forEach(doc => {
        if ( doc.docType === 'provider' ) {
          const serviceId = doc.id.replace(/provider:/, 'service:').replace(/Provider$/, '');
          const serviceDocs = aliasMap.getDocs(serviceId);

          if ( serviceDocs.length === 1 ) {
            const serviceDoc = serviceDocs[0];
            doc.serviceDoc = serviceDoc;
            serviceDoc.providerDoc = doc;
          } else if ( serviceDocs.length === 0 ) {
            log.warn(createDocMessage('Missing service "' + serviceId + '" for provider', doc));
          } else {
            log.warn(createDocMessage('Ambiguous service name "' + serviceId + '" for provider', doc) + '\n' +
              serviceDocs.reduce((msg, doc) => `${msg}\n  "${doc.id}"`, 'Matching docs: '));
          }
        }
      });
    }
  };
};