var _ = require('lodash');
var StringMap = require('stringmap');

/**
 * @dgService partialIdMap
 * @description
 * A map of partial ids to docs
 */
module.exports = function partialIdMap() {
  var map = new StringMap();

  return {
    /**
     * Add a new document to the map associating it with each of its potential partial ids
     * @param {Object} doc The document to add to the map
     */
    addDoc: function(doc) {

      // We store references to this doc under all its partial ids in the map
      // This map will be used to match relative links later on
      _.forEach(doc.partialIds, function(partialId) {

        // Try to get a list of docs that match this partialId
        var matchedDocs = map.get(partialId) || [];
        matchedDocs.push(doc);
        map.set(partialId, matchedDocs);

      });

    },

    /**
     * Remove a document from the map, including entries for each of its partialIds
     * @param  {Object} doc The document to remove
     */
    removeDoc: function(doc) {

      _.forEach(doc.partialIds, function(partialId) {

        var matchedDocs = map.get(partialId);
        if ( matchedDocs ) {
          // We have an array of docs so we need to remove the culprit
          var index = matchedDocs.indexOf(doc);
          if ( index !== -1 ) {
            matchedDocs.splice(index, 1);
          }
        }

      });
    },

    /**
     * Get the documents associated with the given partialId
     * @param  {string} partialId The partialId to search for
     * @return {Array}              An array containing all matched docs
     */
    getDocs: function(partialId) {
      return map.get(partialId) || [];
    }
  };

};