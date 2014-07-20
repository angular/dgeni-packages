module.exports = function(code) {
  return {
    name: 'code',
    process: function(str, lang) {
      return code(str, true, lang);
    }
  };
};