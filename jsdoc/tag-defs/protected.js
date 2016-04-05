module.exports = function() {
  return {
    name: 'protected',
    transforms: function(doc, tag, value) {
      return !value.trim() || value;
    }
  };
};