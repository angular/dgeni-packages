module.exports = function(booleanTagTransform) {
  return {
    name: 'async',
    transforms: [ booleanTagTransform ]
  };
};
