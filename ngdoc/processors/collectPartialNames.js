/**
 * @dgProcessor collectPartialNamesProcessor
 * @description
 * Add all the docs to the partialNameMap
 */
module.exports = function collectPartialNamesProcessor(partialNameMap) {
  return {
    $runAfter: ['compute-id'],
    $process: function(docs) {
      docs.forEach(function(doc) {
        partialNameMap.addDoc(doc);
      });
    }
  };
};