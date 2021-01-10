/**
 * Change the value of a tag to a boolean value (used by jsdoc tags like `@async`).
 * @param  {Tag} tag The tag to process
 */
module.exports = function booleanTagTransform() {
  return function(doc, tag, value) {
    return value !== null && value !== undefined;
  };
};
