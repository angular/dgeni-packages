/**
 * Processor that links the inherited symbols to the associating dgeni doc.
 **/
module.exports = function linkInheritedDocs(typescriptSymbolMap) {
  return {
    $runAfter: ['readTypeScriptModules'],
    $runBefore: ['parsing-tags'],
    $process: docs => {
      // Iterate through all docs and link the doc symbols if present.
      docs.filter(doc => doc.inheritedSymbols).forEach(doc => linkDocSymbols(doc))
    }
  };

  function linkDocSymbols(doc) {
    doc.inheritedDocs = [];
    doc.inheritedSymbols.forEach(symbol => doc.inheritedDocs.push(typescriptSymbolMap.get(symbol)));
  }
};
