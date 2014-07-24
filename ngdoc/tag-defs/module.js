var path = require('canonical-path');

module.exports = function() {
  return {
    name: 'module',
    defaultFn: function(doc) {
      if ( doc.area === 'api' ) {
        return path.dirname(doc.fileInfo.relativePath).split('/')[0];
      }
    }
  };
};