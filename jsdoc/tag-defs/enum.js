module.exports = function(extractTypeTransform) {
  return {
    name: 'enum',
    transforms: [ extractTypeTransform ]
  };
};
