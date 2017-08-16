module.exports = function(extractTypeTransform, wholeTagTransform) {
  return {
    name: 'propertyof',
    transforms: [ extractTypeTransform, wholeTagTransform ]
  };
};
