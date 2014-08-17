var _ = require('lodash');
var StringMap = require('stringmap');

/**
 * @dgProcessor computeIdsProcessor
 * @description
 * Compute the id property of each doc based on the tags and other meta-data from a set of templates
 */
module.exports = function computeIdsProcessor(log, partialIdMap, createDocMessage) {

  var getIdMap, getPartialIdsMap;

  var initializeMaps = function(idTemplates) {
    getIdMap = new StringMap();
    getPartialIdsMap = new StringMap();

    idTemplates.forEach(function(template) {
      if ( template.docTypes ) {
        template.docTypes.forEach(function(docType) {

          if ( template.getId ) {
            getIdMap.set(docType, template.getId);
          } else if ( template.idTemplate ) {
             getIdMap.set(docType, _.template(template.idTemplate));
          }

          if ( template.getPartialIds ) {
            getPartialIdsMap.set(docType, template.getPartialIds);
          }

        });
      }
    });
  };

  return {
    $runAfter: ['computing-ids'],
    $runBefore: ['ids-computed'],
    $validate: {
      idTemplates: { presence: true }
    },
    idTemplates: [],
    $process: function(docs) {
      initializeMaps(this.idTemplates);

      docs.forEach(function(doc) {

        try {

          if ( !doc.id ) {
            var getId = getIdMap.get(doc.docType);
            if ( !getId ) {
              log.debug(createDocMessage('No id template provided', doc));
            } else {
              doc.id = getId(doc);
            }
          }

          if ( !doc.partialIds ) {
            var getPartialIds = getPartialIdsMap.get(doc.docType);
            if ( !getPartialIds ) {
              log.debug(createDocMessage('No partial id template provided', doc));
            } else {
              doc.partialIds = getPartialIds(doc);
            }
          }

          partialIdMap.addDoc(doc);

        } catch(err) {
          throw new Error(createDocMessage('Failed to compute ids/partialIds for doc', doc, err));
        }

        log.debug('computed id for:', '"' + doc.id + '" (' + doc.docType + ')');

      });
    }
  };
};
