var _ = require('lodash');
var path = require('canonical-path');

module.exports = function relativeLinkInlineTag() {
  return {
    name: 'relativeLink',
    process: function(doc, originatingDoc, title) {

      var url;
      if ( doc && doc.path ) {
        title = title || doc.name;
        if ( originatingDoc && originatingDoc.path ) {
          url = path.relative(path.join('/', originatingDoc.path), path.join('/', doc.path));
        } else {
          url = doc.path;
        }
        return _.template('<a href="${url}">${title}</a>', { url: url, title: title });
      } else {
        return doc;
      }
    }
  };
};