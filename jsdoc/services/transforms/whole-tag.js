/**
 * Use the whole tag as the value rather than using a tag property, such as `description`
 * @param  {Tag} tag The tag to process
 */
module.exports = function wholeTag(doc, tag, value) {
  return tag;
};