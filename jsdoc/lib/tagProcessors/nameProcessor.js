var _ = require('lodash');

// Matches:
// name, [name], [name=default], name text, [name] text, [name=default] text, name - text, [name] - text or [name=default] - text
var NAME_AND_DESCRIPTION = /^\s*(\[([^\]=]+)(?:=([^\]]+))?\]|\S+)((?:[ \t]*\-\s*|\s+)(\S[\s\S]*))?\s*$/;

/**
 * Extract the name information from a tag
 * @param  {Tag} tag The tag to process
 */
function extractName(tag) {

  tag.description = tag.description.replace(NAME_AND_DESCRIPTION, function(match, name, optionalName, defaultValue, description, dashDescription) {
    tag.name = optionalName || name;

    if ( optionalName ) {
      tag.optional = true;
    }
    
    if ( defaultValue ) {
      tag.defaultValue = defaultValue;
    }

    var aliasParts = tag.name.split('|');
    tag.name = aliasParts[0];
    tag.alias = aliasParts[1];

    return dashDescription || description || '';
  });

}

/**
 * Process the name information in the tags
 * @param  {TagCollection} tags The collection of tags to process
 */
module.exports = function(tag) {
  if ( tag.tagDef && tag.tagDef.canHaveName ) {
    try {
      extractName(tag);
    } catch(e) {
      tag.errors = tag.errors || [];
      tag.errors.push(e);
    }
  }
};