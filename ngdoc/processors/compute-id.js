var _ = require('lodash');
var partialsFolder;

module.exports = {
  name: 'compute-id',
  description: 'Compute the id property of the doc based on the tags and other meta-data',
  runAfter: ['tags-extracted'],
  process: function(docs, partialNames) {
    
    _.forEach(docs, function(doc) {
    
      if ( doc.area === 'api' && doc.docType !== 'overview' ) {
        
        if ( doc.docType === 'module' ) {
          doc.id = _.template('module:${name}', doc);
        } else if ( doc.name.indexOf('#' ) === -1 ) {
          doc.id = _.template('module:${module}.${docType}:${name}', doc);
        } else {
          doc.id = doc.name;
        }

      } else {

        if (doc.docType === 'error') {
          doc.id = doc.name;
        } else {
          doc.id = doc.fileName;
        }

      }
    
    });

  }
};