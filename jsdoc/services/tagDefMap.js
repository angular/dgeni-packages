require('es6-shim');
var _ = require('lodash');

module.exports = function tagDefMap(tagDefinitions) {
  // Create a map of the tagDefinitions so that we can look up tagDefs based on name or alias
  var map = new Map();
  tagDefinitions.forEach(function(tagDefinition) {
    map.set(tagDefinition.name, tagDefinition);
    if ( tagDefinition.aliases ) {
      tagDefinition.aliases.forEach(function(alias) {
        map.set(alias, tagDefinition);
      });
    }
  });
  return map;
};