module.exports = function() {
  return {
    name: 'private',
    transforms: function(doc, tag, value) {
      return !value.trim() || value;
    }
  };
};