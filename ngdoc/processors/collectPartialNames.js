/**
 * @dgProcessor collectPartialNamesProcessor
 * @description
 * Add all the docs to the partialNameMap
 */
module.exports = function collectPartialNamesProcessor(partialNameMap) {
  return {
    $runAfter: ['computeIdProcessor'],
    $process: function(docs) {
      docs.forEach(function(doc) {
        partialNameMap.addDoc(doc);
      });
    }
  };
};