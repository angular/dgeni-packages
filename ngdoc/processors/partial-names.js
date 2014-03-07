var PartialNames = require('../utils/partial-names').PartialNames;
var _ = require('lodash');

module.exports = {
  name: 'partial-names',
  description: 'Add all the docs to the partialNames store',
  runAfter: ['compute-id'],
  init: function(config, injectables) {
    injectables.value('partialNames', new PartialNames());
  },
  process: function(docs, partialNames) {
    _.forEach(docs, function(doc) {
      partialNames.addDoc(doc);
    });
  }
};