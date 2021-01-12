module.exports = function(encodeCodeBlock) {
  return {
    name: 'code',
    process(str, lang) {
      return encodeCodeBlock(str, true, lang);
    }
  };
};