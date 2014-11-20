/**
 * @dgRenderFilter firstLine
 * @description Extract the first line from the value
 */
module.exports = {
  name: 'firstLine',
  process: function(str) {
    if (!str) return str;

    var firstLine = str
      .split("\n")[0];
    if (firstLine.split("{@").length > firstLine.split("}").length) {
      var match = str.match(/\n(.*?\})/);
      if (match) {
        firstLine = firstLine + ' ' + match[1];
      }
    }

    return firstLine;
  }
};