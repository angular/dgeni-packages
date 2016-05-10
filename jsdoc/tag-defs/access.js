module.exports = function(extractAccessTransform) {
  extractAccessTransformImpl.accessProperty = 'access';
  extractAccessTransformImpl.accessTagName = 'access';
  return {
    name: 'access',
    transforms: extractAccessTransform
  };
};