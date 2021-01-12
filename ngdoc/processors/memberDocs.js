/**
 * @dgProcessor memberDocsProcessor
 * @description
 * Merge the member docs into their container doc, and remove them from the main docs collection
 */
module.exports = function memberDocsProcessor(log, getDocFromAlias, createDocMessage) {

  const mergeableTypes = {
    method: 'methods',
    property: 'properties',
    event: 'events'
  };

  return {
    $runAfter: ['ids-computed'],
    $runBefore: ['computing-paths'],
    $process(docs) {
      docs = docs.filter(doc => {

        // Is this doc a member of another doc?
        if ( doc.id.indexOf('#' ) !== -1 ) {
          doc.isMember = true;
          const parts = doc.id.split('#');
          doc.memberof = parts[0];
          // remove the 'method:', 'property:', etc specifier from the id part
          doc.name = parts[1].replace(/^.*:/, '');

          log.debug('child doc found', doc.id, doc.memberof);

          let containerDocs = getDocFromAlias(doc.memberof, doc);

          if ( containerDocs.length === 0 ) {
            log.warn(createDocMessage('Missing container document: "'+ doc.memberof + '"', doc));
            return;
          }

          if ( containerDocs.length > 1 ) {
            // The memberof field was ambiguous, try prepending the module name too
            containerDocs = getDocFromAlias(`${doc.module}.${doc.memberof}`, doc);
            if ( containerDocs.length !== 1 ) {
              log.warn(createDocMessage('Ambiguous container document reference: '+ doc.memberof, doc));
              return;
            }
          }

          const containerDoc = containerDocs[0];
          doc.memberof = containerDoc.id;

          // Add this member doc to the container doc
          const containerProperty = mergeableTypes[doc.docType];
          const container = containerDoc[containerProperty] = containerDoc[containerProperty] || [];
          container.push(doc);

        } else {
          return doc;
        }
      });

      return docs;
    }
  };
};
