/**
 * Processes @access tag and its' aliases
 * As result fills up doc.access with correct access value
 *
 * @param  {Tag} tag The tag to process
 */
module.exports = function accessTagTransform(createDocMessage, log) {
  var tags = [], values = [];

  /**
   * Processes doc and returns correct access value
   * @param {Doc} doc current document
   * @param {Tag} tag tag to process
   * @param {String} tag value
   */
  function transformAccess (doc, tag, value) {
    if (tag.tagDef.name != 'access' && tag.tagDef.docProperty != 'access') {
        throw new Error(createDocMessage('Tag @' + tag.tagDef.name + ' does not fill up doc.access property', doc));
    }

    if ( doc.access ) {
        throw new Error(createDocMessage('Access value "' + doc.access + '" is already defined. Only one of [ "@' + tags.join('", "@') + '" ] per comment allowed', doc));
    }

    if (tags.indexOf(tag.tagDef.name) < 0) {
        throw new Error(createDocMessage('Register tag @' + tag.tagDef.name + ' with accessTagTransform.addTag("' + tag.tagDef.name + '") prior to use', doc));
    }

    if (!value) {
        value = tag.tagDef.name;
    }

    if (values.indexOf(value) < 0) {
        throw new Error(createDocMessage('@'+ tag.tagDef.name +' sets value "' + value + '". Only one of [ "' + values.join('", "') + '" ] allowed', doc));
    }

    return value;
  };

  /**
   * Adds tag to the list of allowed @access aliases
   * @param {String} v tag name
   * @returns {accessTagTransform} this for chaining
   */
  transformAccess.addTag = function addTag (v) {
    if (tags.indexOf(v) > -1) {
      log.error('Tag "' + v + '" is already defined');
    }
    tags.push(v);
    return this;
  };

  /**
   * Adds value the list of allowed @access values
   * @param {String} v tag value
   * @returns {accessTagTransform} this for chaining
   */
  transformAccess.addValue = function addValue (v) {
    if (values.indexOf(v) < 0) {
      values.push(v);
    }
    return this;
  };

  return transformAccess;
};