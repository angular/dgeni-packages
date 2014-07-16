module.exports = function() {
  return {
    name: 'type',
    transforms: [ extractTypeTransform, wholeTagTransform ]
  };
};