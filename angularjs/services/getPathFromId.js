var _ = require('lodash');
var pluralize = require('pluralize');

module.exports = function getPathFromId() {
  return function(doc) {
    var segments = [];
    _.forEach(doc.id.split('.'), function(part) {
      var subParts = part.split(':');

      if ( subParts[0] ) { segments.push(pluralize(subParts[0])); }
      if ( subParts[1] ) { segments.push(subParts[1]); }
    });
    return segments.join('/') + '/';
  };
};