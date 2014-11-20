/**
 * @dgRenderFilter firstLine
 * @description Extract the first line from the value
 */
module.exports = {
  name: 'firstLine',
  process: function(str) {
    if (!str) return str;
    
    return str.match(/([^$]*\{@[^}]+\})|.*(\n|$)/)[0]
              .replace("\n", " ")
              .trim();
  }
};