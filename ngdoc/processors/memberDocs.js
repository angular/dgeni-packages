var _ = require('lodash');

/**
 * @dgProcessor memberDocsProcessor
 * @description
 * Merge the member docs into their container doc, and remove them from the main docs collection
 */
module.exports = function memberDocsProcessor(log, partialIdMap, createDocMessage) {

  var mergeableTypes = {
    method: 'methods',
    property: 'properties',
    event: 'events'
  };

  return {
    $runAfter: ['ids-computed'],
    $runBefore: ['computing-paths'],
    $process: function(docs) {
      var parts;

      docs = _.filter(docs, function(doc) {

        // Is this doc a member of another doc?
        if ( doc.name.indexOf('#' ) !== -1 ) {
          doc.isMember = true;
          parts = doc.id.split('#');
          doc.memberof = parts[0];
          doc.name = parts[1];

          log.debug('child doc found', doc.id, doc.memberof);

          var containerDocs = partialIdMap.getDocs(doc.memberof);

          if ( containerDocs.length === 0 ) {
            log.warn(createDocMessage('Missing container document'+ doc.memberof, doc));
            return;
          }

          if ( containerDocs.length > 0 ) {
            // The memberof field was ambiguous, try prepending the module name too
            containerDocs = partialIdMap.getDocs(_.template('${module}.${memberof}', doc));
            if ( containerDocs.length !== 1 ) {
              log.warn(createDocMessage('Ambiguous container document reference: '+ doc.memberof));
              return;
            } else {
              doc.memberof = _.template('${module}.${memberof}', doc);
            }
          }

          // Add this member doc to the container doc
          var containerDoc = containerDocs[0];
          var containerProperty = mergeableTypes[doc.docType];
          var container = containerDoc[containerProperty] = containerDoc[containerProperty] || [];
          container.push(doc);

        } else {
          return doc;
        }
      });

      return docs;
    }
  };
};