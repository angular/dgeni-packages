/**
 * Extract the access property from the tag
 */
module.exports = function extractAccessTransform(createDocMessage) {

  extractAccessTransformImpl.accessProperty = 'access';
  extractAccessTransformImpl.accessTagName = 'access';
  extractAccessTransformImpl.allowedDocTypes = new Set(['property', 'method']);
  extractAccessTransformImpl.allowedTags = new Map();

  return extractAccessTransformImpl;

  /**
   * Processes doc and returns correct access value
   * @param {Doc} doc current document
   * @param {Tag} tag tag to process
   * @param {String} tag value
   */
  function extractAccessTransformImpl (doc, tag, value) {

    var static = extractAccessTransformImpl;

    // Check if this docType is allowed to provide an access value
    if ( !static.allowedDocTypes.has(doc.docType) ) {
      throw new Error(createDocMessage('Illegal use of "@'+ tag.tagDef.name +'" tag.\n' +
                                       'You can only use this tag on the following docTypes: ' + joinKeys(static.allowedDocTypes, ', ', '[ ', ' ]') + '.\n' +
                                       'Register this docType with extractAccessTransform.addDocType("' + doc.docType + '") prior to use',
                                       doc));
    }

    // Check that we have not already provided this value
    if ( doc[static.accessProperty] ) {
      throw new Error(createDocMessage('Illegal use of "@' + tag.tagDef.name +'" tag.\n' +
                                       '`doc.' + static.accessProperty + '` property is already defined as "' + doc[static.accessProperty] + '".\n' +
                                       'Only one of the following tags allowed per doc: ' + joinKeys(static.allowedTags, '", "@', '[ "@access", "@', '" ]'), doc));
    }

    var tagName = tag.tagDef.name;
    if ( tagName !== static.accessTagName ) {

      // Check that the tag has been registered
      if ( !static.allowedTags.has(tagName) ) {
        throw new Error(createDocMessage('Register tag @' + tagName + ' with extractAccessTransform.allowedTags.set("' + tagName + '") prior to use', doc));
      }
      value = tagName;
    }

    // Check that this access value is allowed
    if ( !static.allowedTags.has(value) ) {
      throw new Error(createDocMessage('Illegal value for `doc.' + static.accessProperty + '` property of "' + value + '".\n' +
                                       'This property can only contain the following values: ' + joinKeys(static.allowedTags, '", "', '[ "', '" ]'),
                                       doc));
    }

    // Write the access value to the doc
    doc[static.accessProperty] = value;

    // Return true as the value of the tag if this tag type is to be written to the doc
    if (static.allowedTags.has(value)) {
      return static.allowedTags.get(value);
    }
  }

  function joinKeys(set, joiner, pre, post) {
    var result = pre || '';
    var first = true;
    set.forEach(function(val, key) {
      if (!first) {
        result += joiner;
      }
      first = false;
      result += key;
    });
    if (post) {
      result += post;
    }
    return result;
  }
};