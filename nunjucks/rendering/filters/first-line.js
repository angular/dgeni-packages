/**
 * @dgRenderFilter firstLine
 * @description Extract the first line from the value
 */
module.exports = {
  name: 'firstLine',
  process(str) {
    if (!str) return str;

    return str.match(/([^$]*\{@[^}]+\})|.*$/m)[0];
  }
};