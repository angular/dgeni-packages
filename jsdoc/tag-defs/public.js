module.exports = function() {
  return {
    name: 'public',
    transforms: function(doc, tag, value) {
      return !value.trim() || value;
    }
  };
};