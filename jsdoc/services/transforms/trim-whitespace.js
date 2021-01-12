/**
 * Trim excess whitespace from the value
 */
module.exports = function trimWhitespaceTransform() {
  return (doc, tag, value) => typeof value === 'string' ? value.trim() : value;
};