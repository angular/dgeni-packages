/**
 * @dgRenderFilter firstLine
 * @description Extract the first line from the value
 */
module.exports = {
  name: 'firstLine',
  process: function(str) {
    if (!str) return str;

    str = str
      .split("\n")[0];
    return str;
  }
};