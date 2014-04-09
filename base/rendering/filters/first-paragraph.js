module.exports = {
  name: 'firstParagraph',
  process: function(str) {
    if (!str) return str;
    
    str = str
      .split("\n\n")[0];
    return str;
  }
};