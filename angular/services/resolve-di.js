'use strict';


module.exports = function resolveDI() {
  return function(node, doc) {
    if (!node || !node.params) {
      return;  // XXX Remove this check.
    }
    doc.autoTags.requires = node.params.map(param => param.name);
  };
};
