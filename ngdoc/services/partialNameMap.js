var _ = require('lodash');

/**
 * @dgService getPartialNameMap
 * @description
 * A map of partial names to docs
 */
module.exports = function partialNameMap(getPartialNames, parseCodeName) {
  var map = {};

  return {
    /**
     * Add a new document to the map associating it with each of its potential partial names
     * @param {Object} doc The document to add to the map
     */
    addDoc: function(doc) {

      doc.partialNames = getPartialNames(parseCodeName(doc.id));

      // We now store references to this doc under all its partial names in the partialNames map
      // This map will be used to match relative links later on
      _.forEach(doc.partialNames, function(partialName) {

        // Try to get a list of docs that match this partialName
        var matchedDocs = map[partialName] || [];
        matchedDocs.push(doc);
        map[partialName] = matchedDocs;

      });

    },

    /**
     * Remove a document from the map, including entries for each of its partialNames
     * @param  {Object} doc The document to remove
     */
    removeDoc: function(doc) {

      _.forEach(doc.partialNames, function(partialName) {

        var matchedDocs = map[partialName];
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
     * Get the documents associated with the given partialName
     * @param  {string} partialName The partialName to search for
     * @return {Array}              An array containing all matched docs
     */
    getDocs: function(partialName) {
      return map[partialName] || [];
    }
  };

};