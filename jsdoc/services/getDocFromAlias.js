var _ = require('lodash');

/**
 * @dgService getDocFromAlias
 * @description Get an array of docs that match this alias, relative to the originating doc.
 */
module.exports = function getDocFromAlias(aliasMap) {

  return function getDocFromAlias(alias, originatingDoc) {

    var docs = aliasMap.getDocs(alias);

    // If there is more than one item with this name then try to filter them by the originatingDoc's module
    if ( docs.length > 1 && originatingDoc && originatingDoc.module ) {
      docs = _.filter(docs, function(doc) {
        return doc.module === originatingDoc.module;
      });
    }

    return docs;
  };
};