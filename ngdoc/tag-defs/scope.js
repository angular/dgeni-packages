module.exports = function() {
  return {
    name: 'scope',
    transforms(doc, tag) { return true; }
  };
};