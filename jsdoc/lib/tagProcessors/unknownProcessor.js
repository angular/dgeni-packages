/**
 * Process the name information in the tags
 * @param  {TagCollection} tags The collection of tags to process
 */
module.exports = function(tag) {
  if ( !tag.tagDef ) {
    tag.errors = tag.errors || [];
    tag.errors.push('Unknown tag: ' + tag.tagName);
  }
};